import React from 'react';
import TitleItem from './title-item';
import Input from './input';


class Tagging extends React.Component {
    constructor(props) {
        super(props);


        // Expected initial data set
        this.state = {
            changeContent: true,
            initialCount: this.props.initialCount,
            inputText: '',
            editTag: false,
            currentTitle: null,
            maxTitles: 5
        };

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
    titleDoubleClick(id, e) {
        
        e.persist();

        console.log('title - double clicked!', e.target.parentNode.innerText);
        this.setState({
            editTag: true,
            currentTitle: id
        });


    }
    handleTitleEdit(e, id, text){


        console.log('id=', id);
        console.log('text=', text);


        this.state.initialCount.splice(id, 1, { title: text });

        
        this.setState({
            'initialCount': this.state.initialCount,
            'editTag': false
        });


    }
    handleInputEnter(e) {
        // http://stackoverflow.com/questions/22123055/react-keyboard-event-handlers-all-null
        // NOTE: don't forget to remove it post debug
        // e.persist();


        const inputText = e.target.value;

        this.state.initialCount.push({
            title: inputText
        });

        this.setState({
            'initialCount': this.state.initialCount
        });



    }
    render() {

        let inputEl,
            editTagAttr;

        if (this.state.initialCount.length < this.state.maxTitles) {
            inputEl = <Input handleInputEnter={this.handleInputEnter.bind(this)} />;
        }        

        return (
            <div>
                <h2>Tagging</h2>
                <p>List all Tags</p>

                {
                    this.state.initialCount.map(function(item, i) {

                        if (i === this.state.currentTitle) {
                            editTagAttr = this.state.editTag;
                        } else {
                            editTagAttr = false;
                        }

                        return (
                            <TitleItem editTag={editTagAttr} titleDoubleClick={this.titleDoubleClick.bind(this, i)} handleTitleEdit={this.handleTitleEdit.bind(this)} removeItem={this.removeItem.bind(this, i)} id={i} {...item} />
                        );
                        
                        
                    }, this)
                }


                {inputEl}
                
            </div>
        );

    }

}
Tagging.propTypes = {
    initialCount: React.PropTypes.array
};
Tagging.defaultProps = {
    initialCount: [{
        title: 'hi'
    }, {
        title: 'hello'
    }, {
        title: 'bye'
    }]
};

export default Tagging;
