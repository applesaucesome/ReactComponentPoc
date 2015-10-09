import React from 'react/addons';
import Input from '../input';

class Tags extends React.Component {

    constructor(props) {
        // you must pass props every time you have props and you don't set them with 'this.props = props' manually
        super(props);
        this.state = {};

    }
    componentDidMount(){
        
        this.props.onMount(this.refs);
        
    }
    render() {

        let tag = '';
        let inputEl;

        if (this.props.initialCount.length < this.props.maxTitles) {
            inputEl = <Input ref="tagEntry" onTagEntry={this.props.onTagEntry.bind(this)} />;
        }

        return (
            <div>
                {

                    this.props.initialCount.map(function(item, i) {

                        let editTagAttr = false;

    
                        if (i === this.props.currentTitle) {
                            editTagAttr = this.props.editTag;
                        }

                        if (!editTagAttr) {

                            tag = <div style={{margin: 10 + 'px', border: 1+'px solid #cc0000', padding: 10+'px'}} >
                                    <span className="title">
                                        <span onDoubleClick={this.props.onTitleDoubleClick.bind(this, i)} >Title:</span> {item.title}
                                    </span>
                                    <span style={{ margin: 10 + 'px' }} className="remove" onClick={this.props.onRemoveItem.bind(this, i)}>X</span>
                                </div>;                            

                        } else {
                            tag = <Input ref="tagEdit" {...this.props} editTag={editTagAttr} handleTitleEdit={this.props.handleTitleEdit} handleTagEntry={this.props.handleTagEntry} id={this.props.id} />;

                        }

                        return({tag});
                        
                        
                    }, this)
                }
                {inputEl}
            </div>
        );



    }

}

export default Tags;
