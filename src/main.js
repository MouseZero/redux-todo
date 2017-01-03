//----React

const Component = React.Component;

class App extends Component {
  constructor(props){
    super(props)
    console.log('started');
    this.state = {newTodoText: ""};
    this.textBoxChange = this.textBoxChange.bind(this);
    this.addTodoButton = this.addTodoButton.bind(this);
  }

  textBoxChange(event){
    this.setState({newTodoText: event.target.value});
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
      </div>
    )
  }
}

function ListTodos({todos}){
  return (
    <ul>
    {todos.map(elem => 
      <li key={elem.id}>
        <input type="checkbox" />
        &nbsp;
        {elem.text}
      </li>
    )}
    </ul>
  )
}

function ShowTodos({todos}){ console.log(todos);
  return (
    <div>
    </div>
  );
}

//----Redux
let counter = 0;
//- Reducer{}
function reducer(state = {todos: {}}, action){
  const {id, text, isChecked} = action
  switch(action.type){
    case 'ADD_TODO':
      console.log(id, text, isChecked)
      return Object.assign(
        {}, 
        state, 
        {todos: Object.assign(
          {},
          state.todos,
          {[id]: {text, isChecked}}
        )}
      );
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
store.dispatch({type: 'ADD_TODO', id: 5, text: 'my text', isChecked: false});
store.dispatch({type: 'ADD_TODO', id: 4, text: 'my text', isChecked: false});
store.getState();