const FILTERS = ['All', 'Active', 'Done'];

//----React
const Component = React.Component;

class App extends Component {
  constructor(props){
    super(props)
    this.textBoxChange = this.textBoxChange.bind(this);
    this.addTodoButton = this.addTodoButton.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.toggleBox = this.toggleBox.bind(this);
  }

  textBoxChange(event){
    store.dispatch({type: 'CHANGE_TODO_INPUT_TEXT', text: event.target.value});
  }

  toggleBox(event){
    const oldState = store.getState().todos[event.target.name].isChecked;
    store.dispatch({
      type: 'TOGGLE_BOX',
      id: event.target.name,
      isChecked: !oldState
    })
  }

  changeFilter(key){
    store.dispatch({type: 'FILTER_TODOS', filter: FILTERS[key]});
  }

  addTodoButton(){
    store.dispatch({
      type: 'ADD_TODO',
      id: counter++,
      text: store.getState().inputBox,
      isChecked: false
    });
  }

  render(){
    return(
      <div>
        <input type="text" onChange={this.textBoxChange} value={store.getState().inputBox}></input>
        <button onClick={this.addTodoButton}>Add Todo</button>
        <ListTodos todos={ visableTodos(store.getState().todos, store.getState().filter) } toggleBox={this.toggleBox}/>
        <FilterButtons filters={FILTERS} changeFilter={this.changeFilter} filterId={FILTERS.indexOf(store.getState().filter)}/>
      </div>
    )
  }
}

function visableTodos(todos, filter){
  switch(filter){
    case 'Active':
      return Object.keys(todos).reduce((prev, key) => {
        const item = (todos[key].isChecked) ? {} : {[key]: todos[key]};
      return Object.assign({}, prev, item);
      }
      , {});
    case 'Done':
      return Object.keys(todos).reduce((prev, key) => {
        const item = (!todos[key].isChecked) ? {} : {[key]: todos[key]};
        return Object.assign({}, prev, item);
      }
      , {});
    default:
      return todos;
  }
  return todos;
}


function ListTodos({todos, toggleBox}){
  function isDone(todo){
    return ""
  }
  return (
    <ul>
    {Object.keys(todos).map( (tKey, index) => 
      <TodoDisplay 
        key={index} 
        index={index} 
        tKey={tKey} 
        callback={toggleBox} 
        isChecked={todos[tKey]['isChecked']} 
        text={todos[tKey]['text']}
      />
    )}
    </ul>
  )
}

function TodoDisplay({ index, tKey, callback, isChecked, text}){
  return (
    <li key={index}>
      <input type="checkbox" checked={isChecked} onChange={callback} name={tKey}/>
      &nbsp;
      {text}
    </li>
  )
}

function FilterButtons ({ filters, changeFilter, filterId }){
  return (
    <div>
      {filters.map( (elem, index) =>
        <FilterButton key={index} index={index} callback={changeFilter} text={elem} isActive={index === filterId}/>
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
let counter = 0;
//- Reducer{}
function reducer(state = {todos: {}, filter: FILTERS[0], inputBox: ""}, action){
  const {id, text, isChecked, filter} = action
  switch(action.type){
    case 'ADD_TODO':
      return Object.assign(
        {}, 
        state, 
        {todos: Object.assign(
          {},
          state.todos,
          {[id]: {text, isChecked}}
        )}
      );
      case 'TOGGLE_BOX':
        return Object.assign(
          {},
          state,
          {todos: Object.assign(
            {},
            state.todos,
            {
              [id]: {text: state.todos[id].text, isChecked}
            }
          )}
        )
      case 'CHANGE_TODO_INPUT_TEXT':
        return Object.assign(
          {},
          state,
          {inputBox: text}
        )
        return state;
      case 'FILTER_TODOS':
        return Object.assign({}, state, {filter});
      default:
        return state
  }
}

const store = Redux.createStore(reducer)
store.subscribe(render);

//-----Render
function render(){
  ReactDOM.render(
    <App todos={store.getState().todos}/>,
    document.getElementById('root')
  );
}
render();