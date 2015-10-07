import React from 'react/addons';
import Input from './input';

class Tile extends React.Component {

    constructor(props) {
        // you must pass props every time you have props and you don't set them with 'this.props = props' manually
        super(props);        

    }
    render() {


        if (!this.props.editTag) {
            return (
                <div style={{margin: 10 + 'px', border: 1+'px solid #cc0000', padding: 10+'px'}} >
                    <span className="title">
                        <span onDoubleClick={this.props.handleTitleDoubleClick} >Title:</span> {this.props.title}
                    </span>
                    <span style={{ margin: 10 + 'px' }} className="remove" onClick={this.props.handleRemoveItem}>X</span>
                </div>

            );

        } else {
            return (<Input {...this.props} handleTitleEdit={this.props.handleTitleEdit} handleTagEntry={this.props.handleTagEntry} id={this.props.id} />);

        }

    }

}

export default Tile;
