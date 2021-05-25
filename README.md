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

2. Add `phx-hook` and `phx-custom-event-` attributes to elements in your template.

In this example, the `lit-google-element` emits a `bounds_changed` custom event which will become live_view event.

```html
<lit-google-map api-key="" phx-hook="PhoenixCustomEvent" phx-custom-event-bounds_changed="bounds_changed">
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

## Loading events

This hook will also dispatch the following events on the element it is added to:

* `phx-event-start` when an event is sent to live view
* `phx-event-complete` when a reply is received
  
## License

[MIT](LICENSE).
