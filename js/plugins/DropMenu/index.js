import React from 'react';
import classnames from 'classnames';
import Menu from '@js/plugins/Menu';

class DropMenu extends React.Component{
	constructor(props){
		super(props);
	}
	render(){
		const { classNames, type, icon, active, setMenuStatus } = this.props;

		return (
			<div 
				className={classnames("d-e-menu", {
					[classNames]: true
				})}>
				<button
					tabIndex="0"
					className={classnames("d-e-button", {
						[icon]: true,
						'd-e-button-active': active
					})}
					onClick={() => {
						console.log(type, !active);
						setMenuStatus({
							[type]: !active
						})
					}}
				/>
				{active ? this.props.children : ''}
			</div>
		)
	}
}

export default DropMenu;