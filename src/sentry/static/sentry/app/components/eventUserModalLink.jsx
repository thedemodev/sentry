import React from 'react';
import Modal from 'react-bootstrap/lib/Modal';
import {Link} from 'react-router';

import ApiMixin from '../mixins/apiMixin';
import Avatar from '../components/avatar';
import GeoMap from '../components/geoMap_MapBox';
import LoadingError from '../components/loadingError';
import LoadingIndicator from '../components/loadingIndicator';

const LocationsMap = React.createClass({
  propTypes: {
    orgId: React.PropTypes.string.isRequired,
    projectId: React.PropTypes.string.isRequired,
    user: React.PropTypes.object.isRequired,
    height: React.PropTypes.number,
  },

  mixins: [ApiMixin],

  getDefaultProps() {
    return {
      height: 450,
    };
  },

  getInitialState() {
    return {
      loading: true,
      error: false,
    };
  },

  componentWillMount() {
    this.fetchData();
  },

  fetchData() {
    this.setState({
      loading: true,
      error: false
    });

    this.api.request(this.getEndpoint(), {
      success: (data, _, jqXHR) => {
        this.setState({
          error: false,
          loading: false,
          data: data,
        });
      },
      error: () => {
        this.setState({
          error: true,
          loading: false
        });
      }
    });
  },

  getEndpoint() {
    let {orgId, projectId, user} = this.props;
    return `/projects/${orgId}/${projectId}/users/${user.hash}/locations/`;
  },

  renderBody() {
    if (this.state.loading)
      return null;
    else if (this.state.error)
      return <LoadingError onRetry={this.fetchData} />;
    return <GeoMap defaultZoom={0} series={this.state.data} height={this.props.height} />;
  },

  render() {
    return <div style={{height: this.props.height}} className="map-container">{this.renderBody()}</div>;
  },
});

export default React.createClass({
  propTypes: {
    orgId: React.PropTypes.string.isRequired,
    projectId: React.PropTypes.string.isRequired,
    user: React.PropTypes.object.isRequired,
  },

  mixins: [ApiMixin],

  getInitialState() {
    return {
      isModalOpen: false,
      loading: true,
      error: false,
      dataFetchSent: false,
    };
  },

  optimisticallyFetchData() {
    if (this.state.dataFetchSent)
      return;

    this.setState({dataFetchSent: true});

    this.api.request(this.getEndpoint(), {
      success: (data, _, jqXHR) => {
        this.setState({
          error: false,
          loading: false,
          data: data,
        });
      },
      error: () => {
        this.setState({
          error: true,
          loading: false,
          dataFetchSent: false,
        });
      }
    });
  },

  getEndpoint() {
    let {orgId, projectId, user} = this.props;
    return `/projects/${orgId}/${projectId}/users/${user.hash}/`;
  },

  onOpen() {
    this.setState({
      isModalOpen: true,
    }, this.optimisticallyFetchData);
  },

  onClose() {
    this.setState({isModalOpen: false});
  },

  getDisplayName(user) {
    return (
      user.name ||
      `${user.ipAddress} (anonymous)`
    );
  },

  renderModal() {
    return (
      <Modal show={this.state.isModalOpen} onHide={this.onClose} animation={false}>
        <div className="modal-body">
          {this.renderModalBody()}
        </div>
      </Modal>
    );
  },

  renderModalBody() {
    if (this.state.loading)
      return <LoadingIndicator />;
    else if (this.state.error)
      return <LoadingError />;

    let {orgId, projectId, user} = this.props;

    return (
      <div style={{
          overflow: 'hidden',
          margin: '-20px -30px 0',
      }}>
        <div style={{marginTop: -130, position: 'relative'}}>
          <LocationsMap {...this.props} />
        </div>
        <div style={{padding: '20px 30px 0', borderTop: '1px solid #ccc',  marginTop: -160, background: '#fff', opacity: 0.9}}>
          <div className="user-details-header">
            <Avatar user={user} size={128} />
            <div className="user-name">
              <h5>{this.getDisplayName(user)}</h5>
              <small>{user.email || user.ipAddress || ''}</small>
            </div>
            <div className="user-action">
              {user.email &&
                <a href={`mailto:${user.email}`} className="btn btn-default">
                  <span className="icon icon-envelope" style={{verticalAlign: 'middle', marginRight: 10}}/> Send an email
                </a>
              }
            </div>
            <div className="clearfix" />
          </div>
          <div className="row">
            <div className="col-md-7">
              <Link to={`/${orgId}/${projectId}/audience/users/${user.hash}/`} className="btn btn-default">
                View more details
              </Link>
            </div>
            <div className="col-md-5">
              <h6 className="nav-header">Other Info</h6>
              <dl className="flat">
                {user.id && [
                  <dt key="dt-id">ID:</dt>,
                  <dd key="dd-id">{user.id}</dd>
                ]}
                {user.username && [
                  <dt key="dt-username">Username:</dt>,
                  <dd key="dd-username">{user.username}</dd>
                ]}
              </dl>
            </div>
          </div>
        </div>
      </div>
    );
  },

  render() {
    return (
      <a onClick={this.onOpen}>
        {this.getDisplayName(this.props.user)}
        {this.renderModal()}
      </a>
    );
  },
});
