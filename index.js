import React from 'react';
import ReactDOM from 'react-dom';
import Editor from '@js';

ReactDOM.render(
	<Editor>
		<h1 style={{
			textAlign: 'center'
		}}>editor-react</h1>
		<h4 style={{
			textAlign: 'center'
		}}>一款基于React的富文本编辑器，免费、开源</h4>
		<p style={{
			textAlign: 'center'
		}}>
			<img src="../example/images/cat.jpg" />
		</p>
	</Editor>, 
	document.querySelector('#example')
);