/**
 * @license Copyright (c) 2003-2018, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md.
 */

/**
 * @module editor-decoupled/decouplededitormultipleui
 */

import EditorUI from '@ckeditor/ckeditor5-core/src/editor/editorui';
import enableToolbarKeyboardFocus from '@ckeditor/ckeditor5-ui/src/toolbar/enabletoolbarkeyboardfocus';
import normalizeToolbarConfig from '@ckeditor/ckeditor5-ui/src/toolbar/normalizetoolbarconfig';

/**
 * The decoupled editor UI class.
 *
 * @extends module:core/editor/editorui~EditorUI
 */
export default class DecoupledEditorMultipleUI extends EditorUI {
	/**
	 * @inheritDoc
	 */
	constructor( editor, view ) {
		super( editor, view );

		/**
		 * A normalized `config.toolbar` object.
		 *
		 * @type {Object}
		 * @private
		 */
		this._toolbarConfig = normalizeToolbarConfig( editor.config.get( 'toolbar' ) );
	}

	/**
	 * Initializes the UI.
	 */
	init() {
		const editor = this.editor;
		const mainView = this.view;

		mainView.render();

		for ( const editable of mainView.editables ) {
			// Set up the editable.
			const editingRoot = editor.editing.view.document.getRoot( editable.name );
			editable.bind( 'isReadOnly' ).to( editingRoot );
			editable.bind( 'isFocused' ).to( editor.editing.view.document );

			editor.editing.view.attachDomRoot( editable.element, editable.name );

			this.focusTracker.add( editable.element );
		}

		this.view.toolbar.fillFromConfig( this._toolbarConfig.items, this.componentFactory );

		enableToolbarKeyboardFocus( {
			origin: editor.editing.view,
			originFocusTracker: this.focusTracker,
			originKeystrokeHandler: editor.keystrokes,
			toolbar: this.view.toolbar
		} );
	}

	/**
	 * @inheritDoc
	 */
	destroy() {
		this.stopListening();
		this.view.destroy();
	}
}
