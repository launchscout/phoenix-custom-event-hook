# phoenix-custom-event-hook

This package is a [Phoenix LiveView](https://hexdocs.pm/phoenix_live_view/Phoenix.LiveView.html) [hook](https://hexdocs.pm/phoenix_live_view/js-interop.html#client-hooks) that allows you to easily send [Custom Events](https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent/CustomEvent) to your live view.

## Installation

In your phoenix project assets directory

```
npm install phoenix-custom-event-hook
```

## Usage

1. Add the PhoenixCustomEvent hook to your LiveSocket

```javascript
import PhoenixCustomEvent from 'phoenix-custom-event-hook';

let csrfToken = document.querySelector("meta[name='csrf-token']").getAttribute("content")
let liveSocket = new LiveSocket("/live", Socket, { params: { _csrf_token: csrfToken }, hooks: { PhoenixCustomEvent } })
```

2. Add `phx-hook` and `phx-send-events` attributes to elements in your template.

In this example, the `lit-google-element` emits a `bounds_changed` custom event which will become live_view event. The payload will be the detail of the custom event, merged 
with any `data-` attribute values (the event target dataset). This can be customized if needed (see below).

```html
<lit-google-map api-key="" phx-hook="PhoenixCustomEvent" phx-send-events="bounds_changed">
```

3. Handle the event in your live view

```elixir
  def handle_event(
        "bounds_changed",
        %{"north" => north, "east" => east, "west" => west, "south" => south},
        socket
      ) do
    airports =
      Airports.list_airports_in_bounds(%{north: north, east: east, west: west, south: south})

    {:noreply, socket |> assign(airports: airports)}
  end
```

An target component can be specified by assigning a component id to your custom element's `phx-target` attribute. In this example, any events emitted by the `lit-google-map` element will be handled by the LiveComponent that renders it, rather than the LiveView.

```html
<lit-google-map api-key="" phx-hook="PhoenixCustomEvent" phx-target="<%= @myself %>" phx-custom-event-bounds_changed="bounds_changed">
```

Not currently supported: multiple event targets, targeting events by CSS selector.

## Loading events

This hook will also dispatch the following events on the element it is added to:

* `phx-event-start` when an event is sent to live view
* `phx-event-complete` when a reply is received

## Receiving events

If you wish to receive events from LiveView, add a `phx-receive-events` attribute to the element this hook is defined on which contains a list of events you wish to receive. Each event will become a CustomEvent of the same name with the `detail` property containing the payload. 

For example, in LiveView:

```elixir
  socket
  |> push_event("message_updated", %{message: "HI there"})
```

In your Custom Element:

```javascript
  this.addEventListener("message_updated", ({ detail: { message } }) => {
    console.log(message);
  });
```

## Event serialization

As of version 0.0.6, the payload for the event pushed to live view will contain:

* the detail property of the custom event
* the dataset from the event target

This will be merged together into the payload sent to LiveView. If you wish to override this behaviour, you may define your own implemention of the `serializeEvent` function on the hook object, for example:

```js
import PhoenixCustomEvent from 'phoenix-custom-event-hook';
PhoenixCustomEvent.serializeEvent = (event) => { foo: 'bar' };
```

## License

[MIT](LICENSE).
