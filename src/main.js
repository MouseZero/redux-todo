const FILTERS = ['All', 'Active', 'Done'];
const { Provider, connect } = ReactRedux;
const store = Redux.createStore(reducer)
const Component = React.Component;

//----React
// App Display
//////////////////////////////////////////////
function App(props, {store}){
  return(
    <div>
      <TodoInput/>
      <VisableTodos/>
      <FilterButtons/>
    </div>
  )
}


// Todo Inputs Display
//////////////////////////////////////////////
const mapStateToTodoInputProps = (state) => {
  return {inputBoxText: state.inputBox};
};
const mapDispatchToTodoInputProps = (dispatch) => {
  return {dispatch};
};
const mergeTodoInputProps = (storeProps, dispatchProps, ownProps) => {
  return Object.assign(
    {}, storeProps, dispatchProps, ownProps,
    {
      textBoxChange: function (event){
        dispatchProps.dispatch({type: 'CHANGE_TODO_INPUT_TEXT', text: event.target.value})
      },
      addTodoButton: function(){
        dispatchProps.dispatch({
          type: 'ADD_TODO',
          text: storeProps.inputBoxText,
          isChecked: false
        })
      }
    }
  )
}
const TodoInput = connect(
  mapStateToTodoInputProps,
  mapDispatchToTodoInputProps,
  mergeTodoInputProps
)(TodoInputDisplay)

function TodoInputDisplay({ inputBoxText, textBoxChange, addTodoButton }){
  return(
    <div>
      <input type="text" onChange={textBoxChange} value={inputBoxText}></input>
      <GeneralButton callback={addTodoButton} text="Add Todo" />
    </div>
  )
}

// Todo Display
//////////////////////////////////////////////
function toggleBoxEvent(store, event){
  const oldState = store.getState().todos[event.target.name].isChecked;
  store.dispatch({
    type: 'TOGGLE_BOX',
    id: +event.target.name,
    isChecked: !oldState
  })
}
const toggleBox = R.curry(toggleBoxEvent)(store);

const mapStateToProps = (state) => {
  return {
    todos: visableTodos(state.todos, state.filter)
  }
}
const mapDispatchToProps = (dispatch) => {
  return {
    toggleBox: toggleBox
  }
}
const VisableTodos = connect(
  mapStateToProps,
  mapDispatchToProps
)(ListTodos);

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

function visableTodos(todos, filter){
  switch(filter){
    case 'Active':
      return todos.filter(todo => todo.isChecked);
    case 'Done':
      return todos.filter(todo => !todo.isChecked);
  }
  return todos;
}

// Filter Display
//////////////////////////////////////////////
class FilterButtons extends Component {
  componentDidMount(){
    const { store } = this.context
    this.unsubscribe = store.subscribe(() => this.forceUpdate());
  }

  componentWillUnmount(){
    this.unsubscribe();
  }

  render(){
    const {state} = this.context.store.getState().filter;

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
FilterButtons.contextTypes = {
  store: React.PropTypes.object
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
    <Provider store={store}>
      <App
        todos={store.getState().todos}
        inputBoxText={store.getState().inputBox}
        filter={store.getState().filter}
      />
    </Provider>,
    document.getElementById('root')
  );
}
render();
