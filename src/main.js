//----React
function addTodoButton(){
  store.dispatch({
    type: 'ADD_TODO',
    id: counter++,
    text: 'my message',
    isChecked: false
  });
}

function ShowTodos({todos}){
  console.log(todos);
  return (
    <div>
      Hello There
    </div>
  );
}

function Buttons(){
  return(
    <div>
      <button onClick={addTodoButton}>Add Todo</button>
    </div>
  );
}

//----Redux
let counter = 0;
//- Reducer
function reducer(state = {todos: []}, action){
  const {id, text, isChecked} = action
  switch(action.type){
    case 'ADD_TODO':
      return Object.assign(
        {}, 
        state, 
        {
          todos: [...state.todos, {
            id, text, isChecked
          }]
        }
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
    <div>
      <ShowTodos todos={store.getState().todos}/>
      <Buttons/>
    </div>,
    document.getElementById('root')
  );
}
render();