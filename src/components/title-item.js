import React from 'react';


class Tile extends React.Component {

        constructor(props) {
            // you must pass props every time you have props and you don't set them with 'this.props = props' manually
            super(props);
            // console.log('Tile - current props=', this.props);
            this.state = {
                removeItem: false
            };

        }
        componentWillMount() {


        }
        componentWillUnmount() {

        }
        componentDidMount() {

        }
        titleClickHandler(e) {

            e.persist();
            console.log('title - clicked!', e.target.parentNode.innerText);

        }
        render() {

            if (this.state.removeItem === false) {
                return (
                    <div style={{margin: 10 + 'px', border: 1+'px solid #cc0000', padding: 10+'px'}} >
						<span className="title">
						<span onClick={this.titleClickHandler.bind(this)}>Title:</span> {this.props.title}
						</span>
						<span style={{ margin: 10 + 'px' }} className="remove" onClick={this.props.removeItem}>X</span>
					</div>

                );
            }
        }
    }
    // Tile.propTypes = { initialCount: React.PropTypes.number };
    // Tile.defaultProps = { initialCount: 0 };


export default Tile;
