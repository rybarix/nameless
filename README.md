# Nameless
Frontend framework like experience without node_modules

## Introduction
What if you can start building your web application logic without
npm and have similiar experience to react/vue/angular/whatever?

Let me show you my little prototype which implements state management,
data bindings and event bindigs in few lines of code without any library!

## What's in the box?
- **databindig**: bind state props to elements
- **event listeners binding**: bind actions to elements

## Full Usage Example (Step by step)
**We are going to build one input and button todoapp.**

HTML part. Let's say we want to render list of things.
Start with good ol' todos. FULL EXAMLE RIGHT AWAY -> See `full-example.html in repo`
```html
<!-- We need to pass any id and data-state prop 
which will be matched to our state property 
our todos will look like this: 
[ { text: "Todo", id: 1 }, ... ]
-->
<ul id="todos" data-state="todos">

</ul>
```

Next we will define function, how to render them.
```jsx
<ul>
  {this.state.todos.map(t => <li>{t.text}</li>)}
</ul>
```

Easy enough, right?

```html
<!-- Our approach -->
<ul id="todos" data-state="todos">
  <script>
    todos => 
      todos
      .map(t => `<li>${t.text}</li>`)
      .join("")
  </script>
</ul>

```
Vioĺa, it's done. Vanilla JavaScript.
BUT, we don't have any state right now so let's implement it.


```html

<script>
  // Whole application is composed by this single function
  initialize(actions, initialState, changeStateHandler);
</script>
```

Let's define our 2 actions.
- todoInputAction - Triggers after input todoInput changes
- todoSubmitAction - Triggers after submit button is clicked

And also initialState.

```html

<script>
    // actions has simple signature
  function todoInputAction(event, state, dispatch) {
    dispatch('TODO_INPUT', event.target.value); // we could pass any data in second parameter.
    // event is vanila DOM event, we are attaching actions on inputs and buttons.
  }
  // We bind this action on submit button
  function todoSubmitAction(event, state, dispatch) {
    dispatch('TODO_SUBMIT');
  }

  const initialState = {
    todos: [],
    todoInput: ""
  }

  function changeStateHandler(message, data, state) {
    switch(message) {
      case 'TODO_INPUT':
        return {
          ...state,
          todoInput: data // event.target.value is data
        }
      case 'TODO_SUBMIT':
        return { // data param is null in this case, "dataless" message
          ...state,
          todos: [...state.todos, { text: state.todoInput, id: state.todos.length + 1 }]
        }
      // Implement TODO_REMOVE: (hint: pass button on each todo with action with param of todo.id)
    }
  }

  // BRING IT TOGETHER (BUT, LOOK DOWN BELOW TO BIND ACTIONS ON ACTUAL ELEMENTS!)
  initialize({
      todoInputAction,
      todoSubmitAction
    }, 
    initialState, 
    changeStateHandler // we implement this in next step
  );
</script>
```

We need act upon events in form of callback function.

```js
  function changeStateHandler(message, data, state) {
    switch(message) {
      case 'TODO_INPUT': // if message is TODO_INPUT, return new state
        return {
          ...state,
          todoInput: data // event.target.value is data
        }
      case 'TODO_SUBMIT':
        return { // data param is null in this case, "dataless" message
          ...state,
          todos: [...state.todos, { text: state.todoInput, id: state.todos.length + 1 }]
        }
      // Implement TODO_REMOVE: (hint: pass button on each todo with action with param of todo.id)
    }
  }

```

Here is complete version of our code.

**You also need to include library code**

FULL EXAMPLE -> see `full-example.html` in repo
```html
<!-- COMPLETE VERSION -->

<!-- Our approach -->
<ul id="todos" data-state="todos">
  <script>
    todos => 
      todos
      .map(t => `<li>${t.text}</li>`)
      .join("")
  </script>
</ul>

<!--  Let's bind actions on our inputs and buttons -->
<!--
  data-state="todoInput"    => attach todoInput on value property from state
  data-on="change"          => what event do we react upon
  data-action="todoInputAction"   => what action should we call after triggering event
-->
<input
  id="todoInput"
  data-state="todoInput"
  data-on="change"
  data-action="todoInputAction"
  />

<button id="todoSubmitBtn" data-on="click" data-action="todoSubmit">
  Add todo
</button>

<script>
    // actions has simple signature
  function todoInputAction(event, state, dispatch) {
    dispatch('TODO_INPUT', event.target.value); // we could pass any data in second parameter.
    // event is vanila DOM event, we are attaching actions on inputs and buttons.
  }
  // We bind this action on submit button
  function todoSubmitAction(event, state, dispatch) {
    dispatch('TODO_SUBMIT');
  }

  const initialState = {
    todos: [],
    todoInput: ""
  }

  function changeStateHandler(message, data, state) {
    switch(message) {
      case 'TODO_INPUT':
        return {
          ...state,
          todoInput: data // event.target.value is data
        }
      case 'TODO_SUBMIT':
        return { // data param is null in this case, "dataless" message
          ...state,
          todos: [...state.todos, { text: state.todoInput, id: state.todos.length + 1 }]
        }
      // Implement TODO_REMOVE: (hint: pass button on each todo with action with param of todo.id)
    }
  }

  // BRING IT TOGETHER (BUT, LOOK DOWN BELOW TO BIND ACTIONS ON ACTUAL ELEMENTS!)
  initialize({
      todoInputAction,
      todoSubmitAction
    }, 
    initialState, 
    changeStateHandler
  );
</script>
```