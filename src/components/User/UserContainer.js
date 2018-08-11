import React from 'react';
import { componentFromStream } from 'recompose';
import { ajax } from 'rxjs/ajax';
import {
  debounceTime,
  filter,
  map,
  pluck,
  switchMap
} from 'rxjs/operators';
import './user.css';
import UserComponent from './UserComponent';
const User = componentFromStream(prop$ => {
  const formatUrl = user => `https://api.github.com/users/${user}`;

  const getUser$ = prop$.pipe(
    debounceTime(1000), /* Wait for 1 second of silence before triggering */
    pluck('user'), /* Pick property instead of manual destructuring*/
    filter(user => user && user.length),
    map(formatUrl),
    switchMap(url =>
      ajax(url).pipe(
        pluck('response'),
        map(UserComponent)
      )
    ),
    map(user => ( /* Return component with prop (reactive based)*/
      <h3>{user}</h3>
    ))
  );
  return getUser$;
});
export default User;