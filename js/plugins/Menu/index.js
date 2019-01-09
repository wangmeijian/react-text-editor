import React from 'react';
import classnames from 'classnames';
/**
 * 有操作面板的菜单基础类
 */
class Menu extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			active: !!props.active
		}
	}
	static getDerivedStateFromProps(props, state){
		return {
			...state,
			active: props.active
		}
	}
	handleToolClick(id){
		const { active } = this.state;

		this.setState({
			active: !active 
		}, () => {
			this.handleSetContent(id);
		})	
	}

	handleSetContent(type, params){
		switch(type){
			case 'bold':
				this.cmd('bold');
				break;
			case 'underline':
				this.cmd('underline');
				break;
			case 'italic':
				this.cmd('italic');
				break;
			case 'font-colors':
				this.cmd('foreColor', false, params);
				break;
			case 'font-size':
				this.cmd('fontSize', false, params);
				break;
			case 'link':
				this.cmd('createLink', false, params);
				break;
			case 'indent':
				this.state.active ? this.cmd('indent') : this.cmd('outdent');
				break;
			case 'align-left':
				this.cmd('justifyLeft');
				break;
			case 'align-center':
				this.cmd('justifyCenter');
				break;
			case 'align-right':
				this.cmd('justifyRight');
				break;
			case 'undo':
				this.cmd('undo');
				break;
			case 'redo':
				this.cmd('redo');
				break;
			case 'fullscreen':
				this.state.active ? this.fullScreen() : this.exitFullscreen();
				break;
		}		
	}
	cmd(...args){
		document.execCommand(...args);
	}

	fullScreen() {
        if (document.body.requestFullScreen) {
            document.body.requestFullScreen();
        } else if (document.body.webkitRequestFullScreen) {
            document.body.webkitRequestFullScreen();
        }
    }
    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
	render(){
		const { type, icon } = this.props;
		const { active } = this.state;

		return (
			<div className="d-e-menu">
				<button className={classnames("d-e-button", {
					[icon]: true,
					'd-e-button-active': active
				})} onClick={() => {
					this.handleToolClick(type);
				}}></button>
			</div>
		)
	}
}

export default Menu;