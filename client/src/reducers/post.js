import {
  GET_POST,
  POST_ERROR,
  LIKE_POST,
  DELETE_POST,
  CREATE_POST,
  SINGLE_POST
} from '../actions/types';

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { payload, type } = action;
  switch (type) {
    case GET_POST:
      return { ...state, posts: payload, loading: false };
    case SINGLE_POST:
      return { ...state, post: payload, loading: false };
    case CREATE_POST:
      return { ...state, posts: [...state.posts, payload], loading: false };
    case LIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === payload.id ? { ...post, likes: payload.likes } : post
        ),
        loading: false
      };
    case POST_ERROR:
      return { ...state, error: payload, loading: false };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== payload),
        loading: false
      };
    default:
      return state;
  }
}
