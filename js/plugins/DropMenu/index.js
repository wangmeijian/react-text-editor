import React from 'react';
import classnames from 'classnames';
import Menu from '@js/plugins/Menu';

class DropMenu extends Menu{
	constructor(props){
		super(props);

	}
	render(){
		return (
			<div className="d-e-menu d-e-font-color">
				<button
					tabIndex="0"
					className="d-e-button icon-font-colors"
					onClick={() => {
						this.handleToolClick('font-colors');
					}}
				/>
				<div
					id="de-font-colors"
					className="d-e-submenu d-e-color-panel"
				>
					{this.renderFontColorPicker()}
				</div>
			</div>
		)
	}
}