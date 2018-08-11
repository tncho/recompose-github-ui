import React from 'react';
import ReactDOM from 'react-dom';
import './observableConfig';
import User from './components/User/UserContainer';
import { componentFromStream, createEventHandler } from 'recompose';
import { combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import './styles.css';

/* componentFromStream is in charge of turning a regular component into an event stream with
*  'props' as the callback argument, therefore, once an actual value is emitted, we can return
*  components based on received props, for example
*  props$ :Observable<prop> -----> map(prop) -----> AppComponent: Observable<component>|
*/
const App = componentFromStream(prop$ => {
  const { handler, stream } = createEventHandler();
  const value$ = stream.pipe(
    map(event => event.target.value),
    startWith('')
  );

  return combineLatest(prop$, value$).pipe(
    map(([props,value]) => (
      <div>
        <input 
          onChange={handler}
          placeholder="GitHub username" />
        <User user={value}></User>
      </div>
    ))
  );
});

const rootElement = document.getElementById('root');
ReactDOM.render(<App />, rootElement);
