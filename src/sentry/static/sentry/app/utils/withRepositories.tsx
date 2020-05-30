import React from 'react';
import Reflux from 'reflux';
import createReactClass from 'create-react-class';

import {Client} from 'app/api';
import {Repository} from 'app/types';
import getDisplayName from 'app/utils/getDisplayName';
import RepositoryStore from 'app/stores/repositoryStore';
import {getRepositories} from 'app/actionCreators/repositories';

type InjectedProps = {
  api: Client;
  orgSlug: string;
  projectSlug: string;
  releaseVersion: string;
};

type State = {
  repos?: Array<Repository>;
  reposLoading?: boolean;
  reposError?: Error;
};

const withRepositories = <P extends InjectedProps>(
  WrappedComponent: React.ComponentType<P>
) =>
  createReactClass<Omit<P, keyof InjectedProps> & Partial<InjectedProps>, State>({
    displayName: `withRepositories(${getDisplayName(WrappedComponent)})`,
    mixins: [Reflux.listenTo(RepositoryStore, 'onStoreUpdate') as any],

    getInitialState() {
      const {orgSlug} = this.props as P & InjectedProps;
      const repoData = RepositoryStore.get(orgSlug);

      return {repos: repoData.repos};
    },

    componentDidMount() {
      this.fetchRepos();
    },

    fetchRepos() {
      const {api, orgSlug} = this.props as P & InjectedProps;
      const repoData = RepositoryStore.get(orgSlug);

      if (!repoData.repos && !repoData.reposLoading) {
        // HACK(leedongwei): Actions fired by the ActionCreators are queued to the back
        // of the event loop, allowing another getRepo for the same repo
        // to be fired before the loading state is updated in store.
        // This hack short-circuits that and update the state immediately.
        RepositoryStore.reposLoading = true;

        getRepositories(api, {orgSlug});
      }
    },

    onStoreUpdate() {
      const {orgSlug} = this.props as P & InjectedProps;
      const repoData = RepositoryStore.get(orgSlug);

      this.setState({repo: repoData.repos});
    },

    render() {
      return <WrappedComponent {...(this.props as P)} {...this.state} />;
    },
  });

export default withRepositories;
