/*
 *
 * 2022/01/02 18:52:09
 */
import React from 'react';
import ReactDOM from 'react-dom';

import style from './test1.less';

class Test extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.setState({
                isShow: true,
            });
    }

    render() {
        return <div className={style['css-module-test']}>test</div>;
    }
}

ReactDOM.render(<Test />, document.querySelector('#content'));
