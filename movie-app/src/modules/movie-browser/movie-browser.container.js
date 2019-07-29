import React from 'react';
import {connect} from 'react-redux';
import {Container, Row, Col} from 'react-bootstrap';
import {AppBar, TextField, RaisedButton} from 'material-ui';
import * as movieActions from './movie-browser.actions';
import * as movieHelpers from './movie-browser.helpers';
import MovieList from './movie-list/movie-list.component';
import * as scrollHelpers from '../common/scroll.helpers';
import MovieModal from './movie-modal/movie-modal.container';

class MovieBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      currentMovies: []
    };
    // Binds the handleScroll to this class (MovieBrowser)
    // which provides access to MovieBrowser's props
    // Note: You don't have to do this if you call a method
    // directly from a lifecycle method
    this.handleScroll = this.handleScroll.bind(this);
  }

  componentDidMount() {
    window.onscroll = this.handleScroll;
    this.props.getLatestMovies(this.state.currentPage);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll() {
    const {latestMovies} = this.props;
    if (!latestMovies.isLoading) {
      let percentageScrolled = scrollHelpers.getPercentageScrolledDown(window);
      if (percentageScrolled > .8) {
        const nextPage = this.state.currentPage + 1;
        this.props.getLatestMovies(nextPage);
        this.setState({currentPage: nextPage});
      }
    }
  }

  render() {
    const {latestMovies} = this.props;
    const movies = movieHelpers.getMoviesList(latestMovies.response);

    return (
      <div>
        <AppBar title='Peter Gosling - New Movie Releases' showMenuIconButton={false} style={{backgroundColor:'#66943e'}}/>
        <Container>
          <Row>
            <p></p>
          </Row>
          <Row>
            <MovieList movies={movies} isLoading={latestMovies.isLoading} />
          </Row>
        </Container>
        <MovieModal />
      </div>
    );
  }
}

export default connect(
  // Map nodes in our state to a properties of our component
  (state) => ({
    latestMovies: state.movieBrowser.latestMovies
  }),
  // Map action creators to properties of our component
  { ...movieActions }
)(MovieBrowser);
