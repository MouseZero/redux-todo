const FILTERS = ['All', 'Active', 'Done'];

//----React
function textBoxChange(event){
  store.dispatch({type: 'CHANGE_TODO_INPUT_TEXT', text: event.target.value});
}

function toggleBox(event){
  const oldState = store.getState().todos[event.target.name].isChecked;
  store.dispatch({
    type: 'TOGGLE_BOX',
    id: event.target.name,
    isChecked: !oldState
  })
}

function changeFilter(key){
  store.dispatch({type: 'FILTER_TODOS', filter: FILTERS[key]});
}

function addTodoButton(){
  store.dispatch({
    type: 'ADD_TODO',
    text: store.getState().inputBox,
    isChecked: false
  });
}

function App({ inputBoxText, todos, filter }){
  return(
    <div>
      <input type="text" onChange={textBoxChange} value={inputBoxText}></input>
      <button onClick={addTodoButton}>Add Todo</button>
      <ListTodos todos={ visableTodos(todos, filter) } toggleBox={toggleBox}/>
      <FilterButtons 
        filters={FILTERS}
        changeFilter={changeFilter} 
        filterId={FILTERS.indexOf(filter)}
      />
    </div>
  )
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

function FilterButtons ({ filters, changeFilter, filterId }){
  return (
    <div>
      {filters.map( (elem, index) =>
        <FilterButton 
          key={index}
          index={index} 
          callback={changeFilter} 
          text={elem} 
          isActive={index === filterId}
        />
      )}
    </div>
  )
}

function FilterButton ({ index, callback, isActive, text }){
  return (
    <button onClick={callback.bind(this, index)}>
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
  console.log("trying to call reduces " + object);
  return oldcombined(object);
}

function reducer(state = {}, action){
  return {
    todos: todosReducer(state.todos, action),
    inputBox: inputBoxReducer(state.inputBox, action),
    filter: filterReducer(state.filter, action)
  }
}

const store = Redux.createStore(reducer)
store.subscribe(render);

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