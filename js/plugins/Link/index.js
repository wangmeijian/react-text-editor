import React from 'react';
import Menu from '@plugins/Menu';

class Link extends Menu{
	constructor(props){
		super(props);
	}
	render(){
		return (			
			<div className="d-e-menu d-e-link">
				<button tabIndex="0" className="d-e-button icon-link" onClick={() => {
					this._handleToolClick('link');
				}}></button>
				<div class="d-e-link-panel">
					<div class="d-e-link-item"><span class="d-e-link-desc">链接地址：</span><input type="text" id="d-e-link-url" tabindex="0" class="d-e-link-input" /></div>
					<div class="d-e-link-item"><button class="d-e-link-save" tabindex="0">保存</button><button class="d-e-link-cancel" tabindex="0">取消</button></div>
				</div>
			</div>
		)
	}	
}


export default Link;