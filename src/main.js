const FILTERS = ['All', 'Active', 'Done'];
const store = Redux.createStore(reducer)
const Component = React.Component;
store.subscribe(render);

//----React
function textBoxChangeEvent(store, event){
  store.dispatch({type: 'CHANGE_TODO_INPUT_TEXT', text: event.target.value});
}
const textBoxChange = R.curry(textBoxChangeEvent)(store);

function toggleBoxEvent(store, event){
  const oldState = store.getState().todos[event.target.name].isChecked;
  store.dispatch({
    type: 'TOGGLE_BOX',
    id: +event.target.name,
    isChecked: !oldState
  })
}
const toggleBox = R.curry(toggleBoxEvent)(store);

function addTodoButtonRaw(store){
  store.dispatch({
    type: 'ADD_TODO',
    text: store.getState().inputBox,
    isChecked: false
  });
}
const addTodoButton = function() { return addTodoButtonRaw(store) }

function App({ inputBoxText, todos, filter }){
  return(
    <div>
      <input type="text" onChange={textBoxChange} value={inputBoxText}></input>
      <GeneralButton callback={addTodoButton} text="Add Todo" />
      <VisableTodos/>
      <FilterButtons/>
    </div>
  )
}

class VisableTodos extends Component {
  render(){
    const state = store.getState()
    return(
      <ListTodos todos={ visableTodos(state.todos, state.filter) } toggleBox={toggleBox}/>
    )
  }
}

function visableTodos(todos, filter){
  switch(filter){
    case 'Active':
      return todos.filter(todo => todo.isChecked);
    case 'Done':
      return todos.filter(todo => !todo.isChecked);
  }
  return todos;
}


function ListTodos({todos, toggleBox}){
  return (
    <ul>
    {todos.map((todo, index) =>
      <TodoDisplay
        key={index}
        index={index}
        callback={toggleBox}
        isChecked={todo.isChecked}
        text={todo.text}
      />
    )}
    </ul>
  )
}

function TodoDisplay({ index, callback, isChecked, text}){
  return (
    <li>
      <input type="checkbox" checked={isChecked} onChange={callback} name={index}/>
      &nbsp;
      {text}
    </li>
  )
}

class FilterButtons extends Component {
  componentDidMount(){
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    const state = store.getState().filter;

    return (
      <div>
        {['All', 'Active', 'Done'].map( (elem, index, allTags) =>
          <GeneralButton
            key={index}
            callback={() => store.dispatch({
              type: 'FILTER_TODOS',
              filter: allTags[index]
              })
            }
            text={elem}
            isActive={state === allTags[index]}
          />
        )}
      </div>
    )
  }
}

function GeneralButton ({isActive, callback, text}){
  return (
    <button onClick={callback}>
      {(isActive) && "--"}
      {text}
      {(isActive) && "--"}
    </button>
  )
}

//----Redux
//- Reducer{}
function inputBoxReducer(state = "", action){
  switch(action.type){
    case 'CHANGE_TODO_INPUT_TEXT':
      return action.text;
  }
  return action.text;
}

function filterReducer(state = FILTERS[0], action){
  switch(action.type){
    case 'FILTER_TODOS':
      return action.filter;
  }
  return state;
}

function todosReducer(state = [], action){
  const {id, text, isChecked} = action;
  switch(action.type){
    case 'ADD_TODO':
      return [
        ...state,
        {text, isChecked}
      ]
    case 'TOGGLE_BOX':
      return [
        ...state.slice(0, id),
        {text: state[id].text, isChecked},
        ...state.slice(id + 1)
      ]
  }
  return state;
}

const oldcombined = Redux.combineReducers;

Redux.combineReducers = function(object){
  return oldcombined(object);
}

function reducer(state = {}, action){
  return {
    todos: todosReducer(state.todos, action),
    inputBox: inputBoxReducer(state.inputBox, action),
    filter: filterReducer(state.filter, action)
  }
}


//-----Render
function render(){
  ReactDOM.render(
    <App
      todos={store.getState().todos}
      inputBoxText={store.getState().inputBox}
      filter={store.getState().filter}
    />,
    document.getElementById('root')
  );
}
render();
