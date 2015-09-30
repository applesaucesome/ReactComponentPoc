import React from 'react';
import TitleItem from './title-item';
import InputTile from './input-tile';

class Ideas extends React.Component {
    constructor(props) {
        super(props);


        // Expected initial data set
        this.state = {
            changeContent: true,
            initialCount: this.props.initialCount,
            inputText: ''
        };

    }

    componentWillMount() {


    }
    componentWillUnmount() {

    }
    componentDidMount() {


    }

    removeItem(id) {
        // this.removeElement(e.target);
        // e.persist();
        console.log('removeItem changed!', id);


        this.state.initialCount.splice(id, 1);
        this.setState({
            'initialCount': this.state.initialCount
        });



    }
    handleInputEnter(e) {
        // http://stackoverflow.com/questions/22123055/react-keyboard-event-handlers-all-null
        // NOTE: don't forget to remove it post debug
        // e.persist();


        let inputText = e.target.value;

        this.state.initialCount.push({
            title: inputText
        });

        this.setState({
            'initialCount': this.state.initialCount
        });


    }
    render() {

        return (
            <div>
                <h2>Ideas</h2>
                <p>List all ideas</p>
                
                {
                    this.state.initialCount.map(function(item, i) {
                        return (
                            <TitleItem removeItem={this.removeItem.bind(this, i)} key={i} {...item}></TitleItem>
                        );
                    }, this)
                
                }
                <InputTile handleInputEnter={this.handleInputEnter.bind(this)} />
            </div>
        );

    }

}
Ideas.propTypes = {
    initialCount: React.PropTypes.array
};
Ideas.defaultProps = {
    initialCount: [{
        title: 'hi'
    }, {
        title: 'hello'
    }, {
        title: 'bye'
    }]
};

export default Ideas;
