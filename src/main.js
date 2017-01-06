const FILTERS = ['Done', 'All', 'Active'];

//----React
const Component = React.Component;

class App extends Component {
  constructor(props){
    super(props)
    console.log('started');
    this.state = {newTodoText: ""};
    this.textBoxChange = this.textBoxChange.bind(this);
    this.addTodoButton = this.addTodoButton.bind(this);
    this.changeFilter = this.changeFilter.bind(this);
    this.toggleBox = this.toggleBox.bind(this);
  }

  textBoxChange(event){
    this.setState({newTodoText: event.target.value});
  }

  toggleBox(event){
    const oldState = store.getState().todos[event.target.name].isChecked;
    console.log(oldState);
    store.dispatch({
      type: 'TOGGLE_BOX',
      id: event.target.name,
      isChecked: !oldState
    })
  }

  changeFilter(key){
    console.log('pressed filter button with ' + key);
    store.dispatch({type: 'FILTER_TODOS', filter: FILTERS[key]});
  }

  addTodoButton(){
    store.dispatch({
      type: 'ADD_TODO',
      id: counter++,
      text: this.state.newTodoText,
      isChecked: false
    });
  }

  render(){
    return(
      <div>
        <input type="text" onChange={this.textBoxChange} value={this.state.newTodoText}></input>
        <button onClick={this.addTodoButton}>Add Todo</button>
        <ListTodos todos={store.getState().todos} toggleBox={this.toggleBox}/>
        <FilterButtons filters={FILTERS} changeFilter={this.changeFilter}/>
      </div>
    )
  }
}


function ListTodos({todos, toggleBox}){
  function isDone(todo){
    console.log(todo.isChecked);
    return ""
  }
  return (
    <ul>
    {Object.keys(todos).map( (elem, index) => 
      <li key={index}>
        <input type="checkbox" checked={todos[elem]['isChecked']} onChange={toggleBox} name={elem}/>
        &nbsp;
        {todos[elem]['text']}
      </li>
    )}
    </ul>
  )
}

function FilterButtons ({ filters, changeFilter }){
  return (
    <div>
      {filters.map( (elem, index) =>
          <button key={index} onClick={changeFilter.bind(this, index)}>
            {elem}
          </button>
      )}
    </div>
  )
}

//----Redux
let counter = 0;
//- Reducer{}
function reducer(state = {todos: {}}, action){
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