// ==UserScript==
// @name         OWOP Operator theme
// @namespace    https://greasyfork.org/en/users/1502179/
// @version      1.0.1
// @description  Futuristic!
// @author       NothingHere7759
// @match        https://ourworldofpixels.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA2XYBAOgDAADZdgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAACMojeFEB6NgAACFtJREFUeF7t3b+OHUUWB+A7mxLYoQWhkUZaCcka+wlICDb0A8A6NqQ8g1MvMZgHICTYxE8AIyQkJEsQ7ooQAuLdlDpaUVtzrqdo/75PukHduXO7uqf9U5/Tf3xxouXu/av/1Pe4Pb/8dH1R3+P/95f6BpBDAEAwAQDBBAAEEwAQTABAMAEAwQQABBMAEEwAQDABAMEEAAQTABBMAEAwAQDBDn8v9e778d/+29/rW9yif3/9RX3rVh39eQSOACCYAIBgAgCCCQAIJgAgmACAYAIAggkACCYAIJgAgGACAIIJAAgmACCYAIBgAgCCbb+XuXs/v/vx2an7PILdzxNwBADBBAAEEwAQTABAMAEAwQQABBMAEEwAQDABAMEEAAQTABBMAEAwAQDBBAAEEwAQrH0v8tHv5+/ez91l/feu/27d7d99noAjAAgmACCYAIBgAgCCCQAIJgAgmACAYAIAggkACCYAIJgAgGACAIIJAAgmACCYAIBgrXuJT3+C5wGc4X7q+taSu/evhvFsfX54/vEwrr+/ara8me7269o9/+7yu7rz9zwA4MYEAAQTABCsVT+c9ABO73zw4TC+fPZiGFfXjx/Wt1p2b7+u3fPvLr+rO389AODGBAAEEwAQLD4A7t6/Gl6r7lw+Gl4vH1z84eutd98bXrBTfABAMgEAwQQABIsPgG5Nfu/J0+E1U3sGsFN8AEAyAQDBBAAEu9h9LX9X91rqOv96v/65vf/duLm79wbU+ZOlu/87AoBgAgCCCQAIFt8DuPrq22H88kHr9uplN7n/4Pd2b3/26u7/jgAgmACAYAIAgsX3AKrZMwJrzd79fP35qt3bn726+78jAAgmACCYAIBg8QGw+jyA7ue7zyCEc4oPAEgmACCYAIBgh78OoKt7HrVr9/bbvf677d7+Xd2/nyMACCYAIJgAgGACAIIJAAgmACCYAIBgAgCCCQAIJgAgmACAYAIAggkACCYAIJgAgGDxzwM4uu794PX/KXj/u3F3qP9X4l8/+ccw/uH5x8N41ez7ZvOZeeeDD4fxbz9+P4y7du//3b+/IwAIJgAgmACAYHoAB9etAWsPoP5fBfXn3Zq8Ovf3VbXH8Ourb4Zxtyewe//v/v0dAUAwAQDBBAAE0wM4uG4NWGv8et78X//8chivmvUUumbfX3sMP3/+2TDubr/d+393/o4AIJgAgGACAILpARxctwasNXM9b16vzV+12lOY1fTV6vfXnsD144fDeNXu/b/793cEAMEEAAQTABDs8D2Abg3U1V3/7vxnNfKqWiN3r81f7Sms1vT1++v2PPf2qWrPYtXu/ccRAAQTABBMAEAwPYCm7vp3579a49aadfX3V816CnU+dXvOegb1+199+tEwnvUQ6vJXt0f9/VV1fVd19x9HABBMAEAwAQDB9ACauuvfnf9qzbp6nv11q/O5fPZiGNeewUy9LmDWQ6jLX90eegDAYQkACCYAIJgACHPn8tHw2q3O5+WDi+G16t6Tp8Nrpi4/jQCAYAIAggkACOY6gKbu+nfnP7sOoJ6nvvrq22F8kzr7nOq1/OeeT13/ur26y6/fv2r3/uMIAIIJAAgmACCYHkBTd/278681bTW71r3WsLPvO5rZ+q+q26tr9/7jCACCCQAIJgAgmAB4w82udX/r3feG15tmtv6r3rTtJQAgmACAYAIAgrkOoKm7/t351/P29Tz17Nr/1Wfo3ba6PnV9Z1av9Z8tr26v7t9v9/7jCACCCQAIJgAg2OF7AEfXreFqjbp67ftqjVzNauau1fXpzme2vLq9rh8/HMaruv9+uvuPIwAIJgAgmACAYHoAm3VruFrj1vPU9bz+rEauP6/q52c1c9dsfao6n99+/H4Y1/nX9a3782x59fdX1eWt6u4/jgAgmACAYAIAgukBbNat4WpNW89T1/P6tUauNXv9eVU/v1qjV7WGXl2fqs7n11ffDOM6/7q+l89eDON6nr/Or85/VfffT3f/cQQAwQQABBMAEEwPYLNuDVfVGrWqNXKt2evPq/r51Rq9qjV4rdFX1fn8/Plnw7hu77r/1vWbzU8PADgsAQDBBAAEWyvY/oej9xC6NVR3/t3l12fTz2rU2TMCaw1dzc6Lr6o9h1qDd9X1efXpR8O4nvev22M2v7p9b9svP123/g07AoBgAgCCCQAI1qofTnoA7fmfe/n1+1Z7BLOafnZefFWt0WsNXq3Ot5rV9NVsfnU+t00PALgxAQDBBAAEa9UPJz2A9vy7y6/n9et57juXj4ZxrXlXa/rVGrqr1tiznsbMak0/6zHUz982PQDgxgQABBMAEKxVP5z0ANrz7y6/1qi1Rr/35OkwrjVv/fyspp/V0OdWexSznkZXXd6sx6AHAByWAIBgAgCCteqH0xvQAzi6bg+hXkdw7vv9q1ozz76/9ihmPY1VdT6ruvtv9++nBwDcmACAYAIAgrXqh5MewHZnqCGH8ep58FWr3/+6rzvQAwBiCQAIJgAgmABgcOfy0fA6t9Xvf/ngYnhxXgIAggkACCYAIFi7qHIdwF5nOI88jF/3effX/f2rXAcAxBIAEEwAQLBW/XAOegh7dWvQo+vuP93t163huxwBQDABAMEEAAQTABBMAEAwAQDBBAAEEwAQTABAMAEAwQQABBMAEEwAQDABAMEEAATbei/yOXSfJ9DVvZ+cnu79+F277+fvcgQAwQQABBMAEEwAQDABAMEEAAQTABBMAEAwAQDBBAAEEwAQTABAMAEAwQQABBMAEOzQ9zL/Gex+HkG6o9+Pv5sjAAgmACCYAIBgAgCCCQAIJgAgmACAYAIAggkACCYAIJgAgGACAIIJAAgmACCYAIBg/wWCExtUgRvecwAAAABJRU5ErkJggg==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555335/OWOP%20Operator%20theme.user.js
// @updateURL https://update.greasyfork.org/scripts/555335/OWOP%20Operator%20theme.meta.js
// ==/UserScript==

// Credits: Unknown person - original design

(() => {
    const waitUntil = (probe, cb, t = 100) => {
        const id = setInterval(() => { try { if (probe()) { clearInterval(id); cb(); } } catch { } }, t);
    };

    // Main style element
    document.getElementsByTagName("style")[0].innerHTML = `:root {
    /* colors */
    --light: #42D0FF;
    --medium: #102332;
    --text: #1B475F;
    --text-shadow: #2A6E93;
    --unloaded-avg: #15374A;
    --close-btn: #42D0FF;
    --link: #82c9ff;
    --link-visited: #ab80f9;
    --link-hover: #76b0dc;
    --msg-none: #999;
    --msg-user: #3ab2ff;
    --msg-mod: #86ff41;
    --msg-admin: #ff4f4f;
    --msg-dc: #6cffe7;
    --msg-server: #ff41e4;
    --msg-tell: #ffb735;

    /* images */
    --btn: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJUExURRAjMkLQ/wAAAHLGqLAAAAADdFJOU///ANfKDUEAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABMz8BIJY/XoAAAADNJREFUKFNjYMAOmOAAUwQmhiwCEUMVAYuhCzEOTiFGRnS3gkVQxKAiSGJwEQYGRhgAcQA8tgHizlmfIgAAAABJRU5ErkJggg==);
    --btn-pressed: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAMAAABhEH5lAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURRAjMgAAAHry3qoAAAACdFJOU/8A5bcwSgAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAABgAAAAAQAAAGAAAAABAAAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAEzPwEglj9egAAAAJ0lEQVQoU2NgIB4wwgGmCEwMWQQihioCFhsiQpgewvQ2LCQQYiAOAImyAOUJrR9hAAAAAElFTkSuQmCC);
    --gui: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGIAAABQCAMAAADVyVCaAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURQAAABAjMkLQ/ypukyYtNf///8LR4Ns+PgAAAF8Q8/QAAAAJdFJOU///////////AFNPeBIAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAASRkBAOgDAABJGQEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAACKyFmG9q9FEwAAA8lJREFUWEe1mFmWwiAQRbETY+9/xX1qnhhCq+/HMORdgSpA2+/n1VhSTM3vSwAKUVRipbL7Ulh8gFyFqbX2w+J3+MVkgR6+6Ac+RRiAIIqAholFa8dxHK7DEBEJZEpDwQazIAfzuI3IBDTFkWCDeQhBTbYRx3EEBNSDhZgYgVxgGai1314IZMYwfGllsfoKGcFWxCDEciKWExk6MoEZNxHLcNB6QojpDmIV1Fo9RqxTa5GaUguTM0Bki4LIG0opc6WPChlSr+f/hQzwhK8sMfJZBM14JHx8M2cC591XEChNQZo0rc299spePsmhqNXxnccjlHNz68WsyCU5FqmutZBagPAMbHYd+mkhChlICAwDS18sQl6oJbUag1pzOqoqghNGGbwBGQNecTnlt1q19QpJHhHMMANiyNRq2roOwVoUkvw7CEtyKiniqBPFDq2FI6l2KArrBA9YYdhqQK32Vu0Rhd/Jj4IYVoWK72Oz6zB2B9WI4upAABNfXDRH1Yjiat8JPGJ51e5VI+rzKhH1BaWIwiKLG/PMe7m+E4UNjU8PFCDssa/Gaz1ZiySPwJ3tBgLthx2Kwiichg6Nvv5iorwA8cj+cwSOYRa0SXgUZP+feOQF8Sh2ELD4nWFI2pTQgaKsxz3JWuQ1IWM+7sILPEvjcWYp4hEhhkgQ6IjHqlUtZAh4rY8IkHup5+URHhIR/oI9Pyo6igiDRARtnFgHEbUDqAiBBAQdq7R3YtDuEDqIOgoB8Cg4MaLPRBlBJck9aA0AvQhuTFVEMEADRi4nPqLeGgUD3AYlvzNdhL6zFgpIo8jZ/e+ISrLr7EaODTRAjDfzfb2NOM/zzHVRjCjb+V3E+Xs+n3MGI8qRsYG4rgWC7zy6gbJyv4HAfDlRu/eoqIU7Kiz3nXsULjB/oFxVXx5x6x4Fy/sE6+uJuuAZqnI/1XbQgt0l/kKB4pABiBxNc8R1JQIyJmEFiDoQ/5M7BQDEaCIQY4xY36MyoxJoRbytl+60Ko+Qv0LpgsCvwGoUDQEuu1VcQY1KMEZvEDCM7KwihP+1TgywCwT9fYiDeL3MnZ63ELgyhAgEh3i9jMHP/0XYKOwnKExURexNlEfIn+t2j8JhXK+Xrgg9jwlLhJdb78utOTxPBtGJKCTIfzgdAmYfTD4BcEOZESwv4hjcDaQQaBO5cP87+dE5FrmoaXaTUjfIRbpJhSOEjFVTQghM20jMkBiJgAeE+o+3DlKIfXuOf2+mP5JI/kiaKiCcvGcewqbuIDZ+OvbEiLKdv+capHnxRcR796g7+gPN4qn5lByW/gAAAABJRU5ErkJggg==);
    --border-small: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURTAwMCpukxtHXwAAAH1rd1YAAAAEdFJOU////wBAKqn0AAAACXBIWXMAAA7BAAAOwQG4kWvtAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjlsbto+AAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABAAAABaAAAAaYcEAAEAAABqAAAAAAAAANl2AQDoAwAA2XYBAOgDAABQYWludC5ORVQgNS4xLjkAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJQAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAAAjKI3hRAejYAAAA8SURBVBhXtY9BCgAwCMPS+v8/DxUZ287LQamgrQAxkMjVEqvKxhBIbiQitd3rHj33PukZlP+d78l//rcAs+IBgzS3XPIAAAAASUVORK5CYII=);
    --unloaded: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAACpukwLF/i4AAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA8nYBAOgDAADydgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAArIfcnPEIHlAAAABpJREFUGNNjYBAUZABjRgEIZIDyBREidFQDADGvBEHGsTg5AAAAAElFTkSuQmCC);
    --win-out: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbCAMAAAC6CgRnAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURQAAAP///1dXVypukzAwMA0NDRoZGQAAAO8/sG8AAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAALEwAACxMBAJqcGAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAABJGQEA6AMAAEkZAQDoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAIrIWYb2r0UTAAAAkUlEQVQoU83SQRKFIAwD0FCR3P/Gf5oWsOq4/lkpbwRsCwIA79Ei0Fo8lpCtIc1qpvkWB2nWI2Z612aL8qiFOrHQRBf6h1dKlIBWSWhhfotCpN9I9hDyOHuf5z1ojPFuQ/k78/9T4a+W/+d1OautuqiesU9m1zP6UGn2IftXSf3bfS+0ZuJrXt7mbNs9sfgx1z+u2w4RjUJB9wAAAABJRU5ErkJggg==);
    --win-in: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA8AAAAPCAMAAAAMCGV4AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURULQ/ypukw0NDRoZGQAAAIfsZ6gAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOvwAADr8BOAVTJAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACmdgEA6AMAAKZ2AQDoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAAUGlMq5UXprAAAALUlEQVQYV8XIuREAIAzEQGFd/zUzBDyuAGUrgLGDWsypbEzsTL67GkVfLt+hTlmOAxY+7+GTAAAAAElFTkSuQmCC);
    --gui-plus: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURTAwMELQ/ypukxtHXwAAAAF0RucAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwQAADsEBuJFr7QAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAADZdgEA6AMAANl2AQDoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAAIyiN4UQHo2AAAAPUlEQVQYV22O0QoAIAgDdfn/3xyumVHdg+yQoRYRYYSJw91xKvBXQlVMsNBGjFcrJuprU79Q++6t2WvdtQmnIgGhoCks1gAAAABJRU5ErkJggg==);
    --gui-load: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAPUExURTAwMELQ/ypukxtHXwAAAAF0RucAAAAFdFJOU/////8A+7YOUwAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAADydgEA6AMAAPJ2AQDoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAACsh9yc8QgeUAAAARklEQVQYV42NwQ0AMQjDTGD/mU8JSP2eH4VQ6jIBru5Zdc1F/Y3gGBvxVEnyQkbu1XsLOLfr4C8hSRbEEjKLZclKP/L6MR/NZwGfpYii8QAAAABJRU5ErkJggg==);
    --gui-save: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAMAAAAolt3jAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURTAwMCpuk0LQ/wAAAHinzGwAAAAEdFJOU////wBAKqn0AAAACXBIWXMAAA7CAAAOwgEVKEqAAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjlsbto+AAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABAAAABaAAAAaYcEAAEAAABqAAAAAAAAAPJ2AQDoAwAA8nYBAOgDAABQYWludC5ORVQgNS4xLjkAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJQAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAAKyH3JzxCB5QAAABCSURBVBhXbY9JDsBACMMc+P+f23S2VJqcMAYhaHa6G0RVQSH+KBa6IwnjzMRI2lGuXW8PtKnv1N16IC0cG8PxwgsPRcUAp+VeBgsAAAAASUVORK5CYII=);
}

/*! Generated by Font Squirrel (https://www.fontsquirrel.com) on September 7, 2017 */
/* Source: http://www.dafont.com/pixel-operator.font */
@font-face {
    font-family: pixel-op;
    src: url(/font/pixeloperator..woff2) format('woff2'),
        url(/font/pixeloperator..woff) format('woff');
    font-weight: normal;
    font-style: normal;
}

::-webkit-scrollbar {
    width: 16px;
    height: 16px;
}

::-webkit-scrollbar-corner {
    background-color: rgba(0, 0, 0, 0);
}

/*::-webkit-scrollbar-track {
	height: 16px;
	width: 16px;
	border: 6px solid;
	border-image: url(img/button_pressed.png) 6 repeat;
	background-color: #4d313b;
	border-width: 6px;
	background-origin: border-box;
	background-repeat: no-repeat;
}*/
::-webkit-scrollbar-button {
    height: 16px;
    width: 16px;
    border: 6px solid;
    border-image: var(--btn) 6 repeat;
    background-image: var(--gui);
    background-color: var(--light);
    border-width: 6px;
    background-origin: border-box;
    background-repeat: no-repeat;
}

::-webkit-scrollbar-button:hover {
    filter: brightness(110%);
}

::-webkit-scrollbar-button:active {
    filter: brightness(90%);
    border-image: var(--btn-pressed) 6 repeat;
}

::-webkit-scrollbar-button:disabled {
    filter: brightness(90%);
    border-image: var(--btn-pressed) 6 repeat;
}

::-webkit-scrollbar-button:vertical:increment {
    background-position: -32px 0px;
}

::-webkit-scrollbar-button:vertical:increment:disabled {
    background-position: -48px 0px;
}

::-webkit-scrollbar-button:vertical:decrement {
    background-position: 0px 0px;
}

::-webkit-scrollbar-button:vertical:decrement:disabled {
    background-position: -16px 0px;
}

::-webkit-scrollbar-button:horizontal:increment {
    background-position: 0px 16px;
}

::-webkit-scrollbar-button:horizontal:increment:disabled {
    background-position: -16px 16px;
}

::-webkit-scrollbar-button:horizontal:decrement {
    background-position: -32px 16px;
}

::-webkit-scrollbar-button:horizontal:decrement:disabled {
    background-position: -48px 16px;
}

::-webkit-scrollbar-thumb {
    border: 6px solid;
    border-image: var(--btn) 6 repeat;
    background-color: var(--light);
    border-width: 6px;
}

::-webkit-scrollbar-thumb:hover {
    filter: brightness(110%);
}

::-webkit-scrollbar-thumb:active {
    filter: brightness(90%);
    border-image: var(--btn-pressed) 6 repeat;
}

.context-menu {
    position: absolute;
    border: 5px var(--light) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    background-color: var(--medium);
    box-shadow: 0px 0px 5px #000;
}

/*.context-menu>button {}*/

html,
body {
    font: 16px pixel-op, sans-serif;
    width: 100%;
    height: 100%;
    margin: 0;
    touch-action: none;
    position: fixed;
}

body {
    background-color: var(--unloaded-avg);
    background-image: var(--unloaded);
    background-size: 16px;
}

html {
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
}

hr {
    border-color: rgba(0, 0, 0, 0.2);
}

.hide {
    display: none !important;
}

.selectable {
    -webkit-user-select: text;
    -moz-user-select: text;
    user-select: text;
}

.centered {
    position: absolute;
    padding-top: 1px;
    /* fix captcha window not being pixel perfect */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.centeredChilds {
    display: flex;
    justify-content: center;
    align-items: center;
}

/* css for improved tooltips */
#tooltip {
    position: absolute;
    z-index: 100;
    border: 5px var(--medium) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    /* background-color: #5c0c91; */
    box-shadow: 0px 0px 5px #000;
    background-color: var(--medium);
    color: #fff;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    pointer-events: none;
}

/* .tooltip {
	pointer-events: none;
	position: absolute;
	top: 0;
	left: 0;
	opacity: 0.9;
} */

.owopdropdown {
    pointer-events: none !important;
    padding: 0 !important;
    padding-top: 1px !important;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    border: none !important;
    background-color: rgba(0, 0, 0, 0) !important;
    transition: transform 0.5s ease-out;
}

button.winframe:active {
    -o-border-image: inherit;
    border-image: inherit;
}

.whitetext,
#xy-display,
#chat,
#dev-chat,
#playercount-display,
#topright-displays,
#topleft-displays>*,
.generic-display,
.nhCont-v1-0 label,
div:has(> .zpslider),
#cursorspan {
    color: #FFF;
    font: 16px pixel-op, sans-serif;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
}

img,
#tool-select {
    image-rendering: pixelated;
}

#load-scr {
    position: absolute;
    height: 100%;
    width: 100%;
    text-align: center;
    font: 0/0 a;
    pointer-events: none;
    transition: transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
    background-image: var(--unloaded);
    box-shadow: 0 0 5px #000;
}

#load-scr:before {
    content: ' ';
    display: inline-block;
    vertical-align: middle;
    height: 100%;
}

#load-ul {
    display: inline-block;
    vertical-align: middle;
    list-style-type: none;
    padding: 0;
    margin: 0;
    max-height: 100vh;
    max-width: 60%;
    min-width: 224px;
    pointer-events: initial;
    transition: transform 1s;
}

.uk-notice.framed {
    max-height: 70vh;
    overflow-y: auto;
}

#noscript-msg,
#status {
    font: 16px pixel-op;
}

#status-msg {
    vertical-align: super;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000, 0 0 2px #000;
}

#spinner {
    margin-right: 8px;
}

#viewport,
#windows,
#animations {
    position: absolute;
}

#windows {
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: 6;
}

#windows>div,
.winframe {
    /* Frame */
    position: absolute;
    pointer-events: initial;
    background-color: var(--light);
    border: 11px var(--light) solid;
    border-width: 11px;
    -o-border-image: var(--win-out) 11 repeat;
    border-image: var(--win-out) 11 repeat;
    border-image-outset: 1px;
    box-shadow: 0px 0px 5px #000;
}

#windows>div>span {
    /* Title */
    display: block;
    pointer-events: none;
    margin-top: -7px;
    text-shadow: 1px 1px var(--text-shadow);
    color: var(--text);
    margin-bottom: 3px;
    min-width: 100%;
    text-align: center;
}

.windowCloseButton {
    /* Close button */
    position: absolute;
    right: 0;
    top: -2px;
    width: 9px;
    height: 9px;
    padding: 0;
    background-image: var(--gui);
    background-position: -48px -32px;
    background-color: var(--close-btn);
    border: none;
}

button.windowCloseButton:active {
    background-image: var(--gui);
    background-position: -48px -41px;
}

.wincontainer {
    /* Item container of windows */
    overflow: auto;
    min-width: 100%;
    /* width: 0;  Older browsers fix */
    height: 100%;
    margin: 0 -5px -5px -5px;
    background-color: var(--medium);
    border: 5px var(--medium) solid;
    border-width: 5px;
    -o-border-image: var(--win-in) 5 repeat;
    border-image: var(--win-in) 5 repeat;
}

#windows>div>div input {
    border: 6px var(--medium) solid;
    -o-border-image: var(--border-small) 6 repeat;
    border-image: var(--border-small) 6 repeat;
    border-image-outset: 1px;
}

#windows>div>div input:focus {
    outline: none;
}

#windows>div>div>* {
    box-sizing: border-box;
}

button {
    border: 6px var(--light) outset;
    -o-border-image: var(--btn) 6 repeat;
    border-image: var(--btn) 6 repeat;
    background-color: var(--light);
    transition: filter 0.125s;
}

button:hover {
    filter: brightness(110%);
    transition: filter 0.125s;
}

button:active {
    border-style: inset;
    -o-border-image: var(--btn-pressed) 6 repeat;
    border-image: var(--btn-pressed) 6 repeat;
    filter: brightness(90%);
    transition: none;
}

button:focus {
    outline: none;
}

#clusters>canvas {
    position: absolute;
    background-image: var(--unloaded);
    background-size: 8px;
}

#animations {
    top: 0;
    left: 0;
}

#palette {
    position: absolute;
}

#xy-display,
.generic-display {
    padding-left: 2px;
}

#playercount-display {
    padding-right: 2px;
}

#palette,
#topright-displays>*,
#topleft-displays>* {
    pointer-events: none;
    transform: translateY(-100%);
    transition: transform 0.75s;
}

#topleft-displays>*,
#topright-displays>* {
    pointer-events: none;
    transition: transform 0.75s;
}

#notice-display {
    pointer-events: all;
    cursor: pointer;
    z-index: 5;
}

#notice-display>* {
    pointer-events: none;
}

#topright-displays,
#topleft-displays {
    position: absolute;
    pointer-events: none;
}

/* #xy-display, #palette {
	position: absolute;
}
#xy-display, #playercount-display, #palette, #topright-displays > * {
	pointer-events: none;
	transform: translateY(-100%);
	transition: transform 0.75s;
}
#topright-displays {
	position: absolute;
	pointer-events: none;
}
#xy-display {
	padding-left: 2px;
	left: -4px;
	top: -4px;
} */

#topright-displays {
    right: -4px;
    top: -4px;
}

#topleft-displays {
    left: -4px;
    top: -4px;
}

#topright-displays>*,
#topleft-displays>* {
    display: inline-block;
    min-height: 8px;
}

#topright-displays:not(.hideui) #dinfo-display[data-pm]:not([data-pm="1"]) {
    transform: initial;
}

#dinfo-display {
    position: relative;
}

#dinfo-display::before {
    content: '' attr(data-pm) 'x boost for ' attr(data-tmo) '!';
    border-right: 1px dashed #00000077;
    margin-right: 1px;
}

#dinfo-hlp {
    pointer-events: all;
    background-color: #00000044;
    border-radius: 100%;
    padding: 0 4px;
    cursor: help;
}

#dinfo-hlp-box {
    display: none;
    position: absolute;
    top: 150%;
    left: -5px;
    width: 150%;
    box-sizing: border-box;
    z-index: 100;
}

#dinfo-hlp:hover~#dinfo-hlp-box {
    display: block;
}

#toole-container {
    overflow: hidden;
}

#playercount-display,
#xy-display,
#palette,
.framed,
#pbucket-display,
#rank-display,
.generic-display {
    border: 5px var(--light) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    background-color: var(--medium);
    box-shadow: 0px 0px 5px #000;
}

.generic-display:active {
    border: 5px var(--light) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    background-color: var(--medium);
    box-shadow: 0px 0px 5px #000;
    filter: brightness(90%);
}

#toole-container>button>div {
    /* ugly */
    position: fixed;
    margin: -18px -4px;
    width: 36px;
    height: 36px;
}

#toole-container>button {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmBAMAAABaE/SdAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURRtHXwAAALXL0DoAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA8nYBAOgDAADydgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAArIfcnPEIHlAAAAEpJREFUKM9tykERADAQhLCthPg3WwEHTybb6d01weIRTDDBBBNMMMEEE0wwwQQTTDDBBBNMMMEEE0wwwQQTTDDBBBNMMMEEE0wwH4ptGA2Oe6SkAAAAAElFTkSuQmCC);
    background-position: top -5px left -5px;
    position: relative;
    display: inline-block;
    width: 40px;
    height: 40px;
    padding: 0;
}

#toole-container>button.selected {
    filter: brightness(70%);
}

#tool-select>button>div {
    position: absolute;
    width: 36px;
    height: 36px;
    margin-left: 50%;
    transform: translate(-50%, -50%);
}

#palette {
    right: -5px;
    top: 50%;
    transform: translateY(-50%) translateX(200%);
    width: 45px;
    height: 40px;
    box-sizing: border-box;
}

#palette-bg {
    position: absolute;
    height: 100%;
    width: 44px;
    top: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    transition: transform 0.75s;
    pointer-events: none;
}

#palette-opts {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    position: absolute;
    right: 50px;
    box-sizing: border-box;
    pointer-events: all;
}

#palette-create {
    background-image: var(--gui-plus);
    background-repeat: no-repeat;
    box-sizing: border-box;
    width: 24px;
    min-height: 24px;
    margin-bottom: 4px;
    cursor: pointer;
}

#palette-load {
    background-image: var(--gui-load);
    background-repeat: no-repeat;
    box-sizing: border-box;
    width: 24px;
    min-height: 24px;
    cursor: pointer;
}

#palette-save {
    background-image: var(--gui-save);
    background-repeat: no-repeat;
    box-sizing: border-box;
    width: 24px;
    min-height: 24px;
    margin-top: 4px;
    cursor: pointer;
}

#picker-anchor {
    position: absolute;
    right: 50px;
    top: -30px;
}

#color-picker {
    position: absolute;
    left: -100%;
}

#palette-colors {
    position: absolute;
    left: -1px;
    top: -9px;
    transition: transform 0.2s ease-out;
}

#palette-colors>div {
    width: 32px;
    height: 32px;
    margin: 8px 0;
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    pointer-events: all;
    cursor: pointer;
}

#player-list {
    max-height: 300px;
    overflow-y: scroll;
}

#player-list>table {
    border-collapse: collapse;
    border: 1px solid #000;
    color: #fff;
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    padding: 2px;
}

#player-list>table>tr:nth-child(odd) {
    background-color: rgba(0, 0, 0, 0.1);
}

#player-list>table>tr:nth-child(even) {
    background-color: rgba(0, 0, 0, 0.3);
}

#player-list>table>tr:first-child {
    text-align: left;
    background-color: rgba(0, 0, 0, 0.5);
}

#player-list td,
#player-list th {
    padding: 2px 6px;
}

#player-list>table>tr>td:nth-child(1) {
    border-right: 1px solid rgba(0, 0, 0, 0.5);
}

#player-list>table>tr>td:nth-child(2) {
    border-right: 1px solid rgba(0, 0, 0, 0.3);
}

#help-button {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0;
    margin: 16px;
    transition: transform 0.75s;
}

#help-button>img {
    width: 64px;
    display: block;
}

#help {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 80%;
    max-width: 800px;

    background-color: var(--light);
    border: 11px var(--light) solid;
    border-width: 11px;
    -o-border-image: var(--win-out) 11 repeat;
    border-image: var(--win-out) 11 repeat;
    border-image-outset: 1px;
    box-shadow: 0px 0px 5px #000;
    max-height: 96%;
    display: flex;
    flex-direction: column;
}



#help>.title {
    display: block;
    pointer-events: none;
    margin-top: -7px;
    text-shadow: 1px 1px var(--text-shadow);
    color: var(--text);
    margin-bottom: 3px;
    min-width: 100%;
    text-align: center;
}

#help>.content {
    overflow: auto;
    flex-grow: 1;
    max-height: 100%;
    min-width: 100%;
    /* width: 0;  Older browsers fix */
    height: 100%;
    margin: 0 -5px -5px -5px;
    background-color: var(--medium);
    border: 5px var(--medium) solid;
    border-width: 5px;
    -o-border-image: var(--win-in) 5 repeat;
    border-image: var(--win-in) 5 repeat;
}

#help>.content>.links {
    text-align: center;
}

#help>.content>.links>* {
    display: inline-block;
    vertical-align: middle;
    width: 76px;
}

#help>.content>.links>* img {
    width: 100%;
}

#help.hidden {
    display: none;
}

#chat {
    transform: translateY(100%);
}

#chat,
#dev-chat {
    position: absolute;
    right: 0;
    bottom: 0;
    min-width: 20%;
    max-width: 450px;
    /* max-height: 40%; // causes problems on old browsers */
    display: flex;
    font-family: pixel-op, monospace;
    flex-direction: column;
    background-color: transparent;
    pointer-events: none;
    overflow: hidden;
    transition: background-color 0.2s, box-shadow 0.2s, transform 0.75s;
    animation-fill-mode: forwards;
}

#dev-chat {
    left: 0;
    right: initial;
}

#chat.active,
#dev-chat.active {
    background-color: rgba(0, 0, 0, 0.8);
    box-shadow: 0px 0px 5px #000;
    pointer-events: all;
    overflow-y: auto;
}

@keyframes fade {
    from {
        opacity: 1;
    }

    to {
        opacity: 0;
    }
}

#chat-messages>li {
    background-color: rgba(0, 0, 0, 0.8);
    animation-name: fade;
    animation-duration: 3s;
    animation-delay: 15s;
    animation-fill-mode: forwards;
    transition: background-color 0.2s;
    white-space: pre-wrap;
}

#chat-messages>li a:link {
    color: var(--link);
}

#chat-messages>li a:visited {
    color: var(--link-visited);
}

#chat-messages>li a:hover {
    color: var(--link-hover);
}

#chat-messages>li.playerMessage {
    color: var(--msg-none);
}

#chat-messages>li.userMessage>.nick {
    color: var(--msg-user);
}

#chat-messages>li.modMessage {
    color: var(--msg-mod);
}

#chat-messages>li.adminMessage,
#chat-messages>li.serverError,
#chat-messages>li.serverRaw {
    color: var(--msg-admin);
}

#chat-messages>li.discord>.nick {
    color: var(--msg-dc);
}

#chat-messages>li.serverInfo {
    color: var(--msg-server);
}

#chat-messages>li.whisper,
#chat-messages>li>.whisper {
    color: var(--msg-tell);
}

#chat-messages .emote {
    max-width: 1.375em;
    max-height: 1.375em;
    vertical-align: bottom;
    image-rendering: auto;
}

#chat-messages.active>li {
    background-color: initial;
    animation-duration: 0s;
    animation-direction: reverse;
}

#chat-messages,
#dev-chat-messages {
    flex: 1;
    margin: 0;
    padding: 0;
    font-size: 16px;
    max-height: 40vh;
    word-wrap: break-word;
    overflow: inherit;
    vertical-align: bottom;
}

#chat-input {
    flex: 0 1 auto;
    height: 16px;
    color: #FFF;
    pointer-events: all;
    border: 1px solid #666;
    padding: 4px;
    background: rgba(0, 0, 0, 0.8);
    font-family: pixel-op, sans-serif;
    font-size: 16px;
    resize: none;
    overflow-y: scroll;
    display: none;
}

#chat-input:focus {
    outline: none;
}

#chat-input::-moz-placeholder {
    color: #BBB;
}

#chat-input::placeholder {
    color: #BBB;
}

#captchawdow {
    margin: -4px;
}

.rainbow-container {
    position: relative;
    display: inline-block;
}

.rainbow {
    background: linear-gradient(to right, #db2a2a, #d16d15, #d4b413, #18fa14, #192abf, #760dd9, #db2a2a);
    -webkit-background-clip: text;
    background-clip: text;
    background-repeat: repeat-x;
    color: transparent;
    animation: rainbow_animation 6s linear infinite;
    background-size: 400% 100%;
    text-shadow: none;
    position: relative;
    z-index: 1;
}

@keyframes rainbow_animation {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: 132% 0;
    }
}

.rainbow-back {
    text-shadow: -1px 0 #000, 0 1px #000, 1px 0 #000, 0 -1px #000;
    color: #000;
    position: absolute;
    left: 0;
    z-index: 0;
}

#keybind-settings {
    display: flex;
    flex-direction: row;
}

#keybinddiv {
    flex-grow: 1;
}

#keybindopts {
    text-align: right;
}

.color-picker-frame {
    border: 5px var(--medium) solid;
    -o-border-image: var(--border-small) 5 repeat;
    border-image: var(--border-small) 5 repeat;
    border-image-outset: 1px;
    box-shadow: 0px 0px 5px #000;
    padding: 5px;
    position: absolute;
    background-color: var(--medium);
    display: flex;
    align-items: stretch;
}

.color-picker-container {
    position: relative;
    width: 200px;
    height: 200px;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 5px;
}

.color-picker-canvas {
    width: 100%;
    height: 100%;
}

.color-picker-slider {
    width: 10px;
    height: 100%;
    border-radius: 24px;
    flex-shrink: 0;
}

.draggableHandle {
    width: 6px;
    height: 6px;
    border: 2px solid #333;
    border-radius: 50%;
    position: absolute;
    cursor: grab;
    z-index: 5;
}

.picker-dragging {
    cursor: grabbing;
}

.palette-load {
    display: flex;
    flex-direction: column;
    align-items: stretch;
}

.palette-load-top {
    flex: 1;
}

.palette-load-bottom {
    display: flex;
    flex-direction: column;
}

.palette-load-palette-container {
    display: flex;
    flex-direction: column;
    max-width: 400px;
    overflow-y: scroll;
    align-items: stretch;
}

.palette-button-row {
    display: flex;
    flex-direction: row;
    gap: 2px;
}

.palette-load-selection-container {
    display: flex;
    flex-direction: column;
}

/*.palette-load-preview {}*/

.palette-load-button-contianer {
    display: flex;
    flex-direction: row;
}`;
    // Link images (Wiki, Discord, Reddit, Facebook)
    const linkImgs = document.querySelectorAll(".links img");
    linkImgs[0].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAnUExURfq4KgAAAELQ/1dXVypukzAwMP/Jk////6+/0v+AAM5nAKhUAAAAACXcr2UAAAANdFJOU////////////////wA96CKGAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjlsbto+AAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABAAAABaAAAAaYcEAAEAAABqAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjkAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJQAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAATM/ASCWP16AAAAERSURBVDhPjdTrtgMRDAXg7Ki6jPd/3rNyYbSHqfxJjW+CKag1IqK2DeulRgAgjXVobyMCM7M01qG9wvVH2MQnezGHEENgyZ60+ZqZKZaOEKInbaoD6RJcsXRI9uROl9C0nD1mjlGzJ3Pcmb+8CKnb2YT61/mAznwEAW8wIyFNMsZ7bhMTlZHS/fiboRQgpQyknPMo+J9V5KQI0AmsmCk37/eeAd2UUjZMZ2YGReKJKVBX10znJv2wao9MncChNkxWgoItYxiz+MXM7QdlXH1uKPV6YFf/IvXas16u1irDf7Fpv+nchdzvjv02b/FxhIcau/fwLByerJNzqsV+n3r7Hmd3yOmN5H/3Ipwd3pZnd+8fszcSAkcNrxUAAAAASUVORK5CYII=";
    linkImgs[1].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAkUExURf///wAAAELQ/1dXVypukzAwMA0cNRp+tjuy1xpNag1OgQAAAMWCcNkAAAAMdFJOU///////////////ABLfzs4AAAAJcEhZcwAACxEAAAsRAX9kX5EAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAALxkBAOgDAAAvGQEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAAj3ZL6iTDaSAAAATBJREFUOE+NlFmWAyEIRRGjIu5/v30YFK1KTssPIdx6gBOMAQAwfpplYUBKKUnw3TQ7ABIiogTfTbOC64/8w07sg5hzyRnFu9Pws2NGoSRyLu40VC6BjuAUSkK8O+d0hKFy9jdiKVWteKj1J+YfI9ZaGxFRq7VOLk8sIGXMWoCOeYVKRLKgi3SuRG+L6r2HonGrt13L1NwZ98BiI6l35V6YdB+YsTLHE3tRIReYi3UptmMqt2Grbck7PYc4ME9sblY9ip7V3D+LsiWO3oCITwwrGUB9G+M1qchJ2nbKwW5i5y40SdteTjFb3RPjOEUq1nszsQMTboHSYJvUxOZ5Y26bsVPrvMXp5Uky8+v0HneB1b7dhcubdXNPVez/W2/rcfeG3L5Iz1ctzLHL1/Lu7f0DspgUCljJTnAAAAAASUVORK5CYII=";
    linkImgs[2].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAeUExURf///wAAAELQ/1dXVypukzAwMCYtNcLR4Ns+PgAAAGsG/84AAAAKdFJOU////////////wCyzCzPAAAACXBIWXMAAAsRAAALEQF/ZF+RAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjlsbto+AAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABAAAABaAAAAaYcEAAEAAABqAAAAAAAAAC8ZAQDoAwAALxkBAOgDAABQYWludC5ORVQgNS4xLjkAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJQAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAAI92S+okw2kgAAAEuSURBVDhPjZRZksUgCEURo+j+N9x1AYnTqw4/gJwgRJF6JyLqP8Wi1CmllODcRaOdKDEzw7mLRoGrkX/Iij3MOZecGdqVus+MGcUI5FxcqatcIm3BKUYAuuRaa1WX+dEWuqYzirkU1bVUosHxwCzHJJWrSPX0A9shBoBNISVnx2yjDQsp5a0NX2sQtVv9sRS1YYmIEBY7IoGNpRXDkgxmkHDBTZjIRiln7S7YThm3YhxVrZw2sXS6M5Cz00sypNsxrLb2EmbfsNZezu0Dkxt2bIp00lpUaPbRgqaTqQ/YlmzB8IdRjEF6eE6tmB6Y6JlXNz2w3TcLhjgV9y1u70hjSZ2K2zvPwnwtt1k4J8vVOlmXOQ13zKkm+3/q7X98e0O+vkj7q/aKYx9fy29v7x+RTg+8rVOjfwAAAABJRU5ErkJggg==";
    linkImgs[3].src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAlCAMAAAAZd2syAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAhUExURf///wAAAELQ/1dXVypukzAwMCYtNXhVp5lp28up+QAAADjZw2YAAAALdFJOU/////////////8ASk8B8gAAAAlwSFlzAAALEQAACxEBf2RfkQAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAgAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAAAvGQEA6AMAAC8ZAQDoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAACPdkvqJMNpIAAAA4UlEQVQ4T62UyxaFIAhFETPS///gu4Bj3p4y6EwQ2YmmQK0REbVHeZQapZSSOveyaCNKzMzq3MuiitsgP+iILcw5l5xZLYy5yz/mFGsg5wJjrnGJ7AigWANqYcDZEZot59PMpZiFcY47ho9vpOt2rEPrSR0EhgyrbAcJuDL2ZtiR2jbHxt5OWK21zrGqVznFjJpjYD7Bqub0E7xheIwzLJDUb2HHcAtXTBQEJvKCiQgR+eATzBNOsaET1t/bRTa9v7fg6w3WQrCyInVqi82r3v9HrIdEO9K5qw0BC3bLWO/9AfQ4FBgqCoF1AAAAAElFTkSuQmCC";
    // Favicon
    document.querySelector('link').href = "data:image/png;base64,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";
    // Help button image
    document.querySelector('#help-button img').src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURQAAAELQ/ypukwAAAH5mgQ0AAAAEdFJOU////wBAKqn0AAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAGHRFWHRTb2Z0d2FyZQBQYWludC5ORVQgNS4xLjlsbto+AAAAtmVYSWZJSSoACAAAAAUAGgEFAAEAAABKAAAAGwEFAAEAAABSAAAAKAEDAAEAAAACAAAAMQECABAAAABaAAAAaYcEAAEAAABqAAAAAAAAAGAAAAABAAAAYAAAAAEAAABQYWludC5ORVQgNS4xLjkAAwAAkAcABAAAADAyMzABoAMAAQAAAAEAAAAFoAQAAQAAAJQAAAAAAAAAAgABAAIABAAAAFI5OAACAAcABAAAADAxMDAAAAAATM/ASCWP16AAAACfSURBVDhPnZFRDsAgCEMZ3v/Oi6NoiyTLxo/QvhipNqgMJdppK7JbM7tQTKxu24FUQH0icFZ/EwVw9xaA708BBcGAu88Vg2gA+CBaIDRc9xXwV2AWATnsHODPR8ZGCsRXNj5/1uMjpQYAlYGmrwAHurQDUL8FyP4OUKCpUa+BpkY9BUoSDytQVnSy+oQKxBYi8TCwhUg8DGwhEg+/trgByoQIWGzuPNQAAAAASUVORK5CYII=";
    // Loading screen logo and spinner
    document.querySelector('#logo').src = "data:image/png;base64,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";
    document.querySelector('#spinner').src = "data:image/gif;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA";

    // Toolset and unloaded pattern
    waitUntil(() => OWOP?.options?.toolSetUrl, () => { OWOP.options.toolSetUrl = 'data:image/png;base64,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'; });
    waitUntil(() => OWOP?.options?.unloadedPatternUrl, () => { OWOP.options.unloadedPatternUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAGUExURQAAACpukwLF/i4AAAAJcEhZcwAADsIAAA7CARUoSoAAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAA8nYBAOgDAADydgEA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAAArIfcnPEIHlAAAABpJREFUGNNjYBAUZABjRgEIZIDyBREidFQDADGvBEHGsTg5AAAAAElFTkSuQmCC'; });
    waitUntil(() => OWOP?.cursors?.slotset, () => {
        let slotcanvas = document.createElement("canvas");
        !function popOut(canvas, img) {
            canvas.width = img.width, canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            for (var idat = ctx.getImageData(0, 0, canvas.width, canvas.height), u32dat = new Uint32Array(idat.data.buffer), clr = function clr(x, y) {
                return x < 0 || y < 0 || x >= idat.width || y >= idat.height ? 0 : u32dat[y * idat.width + x]
            }, i = u32dat.length; i--;) 0 !== u32dat[i] && (u32dat[i] = 4287852074);
            for (var y = idat.height; y--;)
                for (var x = idat.width; x--;) 4287852074 !== clr(x, y) || clr(x, y - 1) && clr(x - 1, y) || clr(x - 1, y - 1) || (u32dat[y * idat.width + x] = 4281475856);
            for (y = idat.height; y--;)
                for (x = idat.width; x--;) 4281475856 === clr(x, y - 1) && 4281475856 === clr(x - 1, y) && (u32dat[y * idat.width + x] = 4281475856);
            ctx.putImageData(idat, 0, 0)
        }(slotcanvas, OWOP.cursors.set);
        slotcanvas.toBlob((function (blob) {
            OWOP.cursors.slotset = URL.createObjectURL(blob);
        }));
    });
    waitUntil(() => document.getElementById("toole-container")?.style?.maxWidth, () => { document.getElementById("toole-container").style.maxWidth = "80px" });

    // Neko Script
    let t = Date.now() + 60000;
    waitUntil(() => NS?.dataImages || t < Date.now(), () => {
        if (t < Date.now()) return;
        NS.dataImages.close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURSpukxAjMkLQ/zm137oQgAwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAE5JREFUGNM9jcENwDAIA2GDmg1iFkDq/rvVbtLy4WRxOOKbxJ5IetGwgGpBKeIIwFWdhqICA6hgA19dikUfj0XpbdEP5zy0gjtP6ZV/+wNzJQkc/aDvpwAAAABJRU5ErkJggg==";
        NS.dataImages.lock = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURSpukxAjMkLQ/zm137oQgAwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAEVJREFUGNN1zcENACEIRFG0AqEDoQEi/fcms8SNF//pHSBDdGpcJTQDxCLWBJyoA+rMYgnDubULeNKC9wN5IL4So7b/9Q2rTwoQLGAjiwAAAABJRU5ErkJggg==";
        NS.dataImages.unlock = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURSpukxAjMkLQ/zm137oQgAwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAADxJREFUGNNjYIABRkEIgDKUlCAMIWVjKMOAAcYQRGIogYAymKFspKTMCGIYMMEYQjgYxmAAZAhA7IbbDgCZlQoYvimZfgAAAABJRU5ErkJggg==";
        NS.dataImages.maximize = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURSpukxAjMkLQ/zm137oQgAwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAADZJREFUGNNjYIABRkEIADGEDGEMA0IMJRBQBjKMjY2MjY0ZGRgFGJgMgMYR0C4MYwgywBggAABukAkINh8nIAAAAABJRU5ErkJggg==";
        NS.dataImages.minimize = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQBAMAAADt3eJSAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAMUExURSpukxAjMkLQ/zm137oQgAwAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAACFJREFUGNNjYIABRkEIIJGhBALKQIYxGDAyMApAjCPPQAARogfGHJpHQAAAAABJRU5ErkJggg==";
    });
    waitUntil(() => document.querySelectorAll("#optionsMinimize").length || t < Date.now(), () => {
        if (t < Date.now()) return;

        // Options background
        let divList = document.querySelectorAll("#optionsMinimize>div");
        divList[0].style.backgroundColor = "var(--medium)";
        divList[0].style.boxShadow = divList[0].style.boxShadow.replace(/rgb\(.+?\)/, "var(--text-shadow)");
        divList[2].style.backgroundColor = "var(--medium)";
        divList[2].style.boxShadow = divList[2].style.boxShadow.replace(/rgb\(.+?\)/, "var(--text-shadow)");
        document.querySelector("#optionsMaximize>div").style.backgroundColor = "var(--medium)";

        // Button background
        document.querySelector("#optionsMinimize>style").innerHTML = document.querySelector("#optionsMinimize>style").innerHTML.replace(`button.on {
								background: #9a937b;
							}`, `button.on {
								filter: brightness(70%);
							}`);

        // Icons tab
        document.querySelector(".NSspan1").parentElement.querySelector("style").innerHTML = document.querySelector(".NSspan1").parentElement.querySelector("style").innerHTML.replace(`.NSdiv2 {
							background: #aba389;
							color: #7e635c;
							border-radius: 6px;
							border: initial;
							padding: 4px;
							text-shadow: 1px 1px #4d313b;
						}`, `.NSdiv2 {
							background: var(--light);
							color: var(--text);
							border-radius: 6px;
							border: initial;
							padding: 4px;
							text-shadow: 1px 1px var(--text-shadow);
						}`).replace(`.NSdiv1 {
							background-image: url("https://ourworldofpixels.com/img/toolset.png");
							width: 36px;
							height: 36px;
						}`, `.NSdiv1 {
							background-image: url("${OWOP.options.toolSetUrl}");
							width: 36px;
							height: 36px;
						}`);

        // Dropdown and patterns tab background
        let nsStyle = document.createElement("style");
        nsStyle.innerHTML = `.ns_dropdown {
            background-color: var(--light);
        }
        .ns_container {
            background-color: var(--medium);
            box-shadow: inset 3px 2px 0px 0px var(--text-shadow);
        }`;
        document.head.appendChild(nsStyle);

        // Toolset
        document.querySelector("div:has(>#toole-container)>style").remove();
        NS.localStorage.cursors.cursor.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVxAjMjAwMAAAAELQ/ypukxtHXwAAAGBHGW8AAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAAsklEQVQ4T63PSQ4DIQwEQIyX/P/HEWgYtwFbOaTFBSh5aZ8f0vaHWxYq8Ysq5ahQgHLliHIFiFrfPlccca4ACVG/K0SpWqg3Fs0UIsvUizqLZiogkftciIRp5lCImIfSUwEaIaFxNhWQMI9CRy1Ayjr7EdmmtpnGfiKiogYqVPIF446AbJinVKyFg0/TMSfSaZ57iKPcODJNDSDWzIR2mXFUmBeZ5sZRYbzd9h6yUJn/oS/7jB4/W+5COAAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.move.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMBtHX0LQ/xAjMipukwAAAAAAADkvBF0AAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAA90lEQVQ4T7XR0Q7DIAgFUC6C/f8/XgC1iF2yJdt9MbGngkhXDaHuXHRsAIeqiMB8qIII3Fiq2pEbPtSGhmEpKiMirJM2tZ90l3t70mc9/QLNBawZjSW+Eo0VsBHMvufqHwkgDyCsGiMYmYhg/3qEtTW1YUa6K7rnzAxh4dbERi7dwq4oTLMos3JTbaIi4r+FmkOOWC3VqBhHuRr3eUBhejd0Wbe3klkuGWsckBGIsIzGk/ERAOvKIm9G4JNNKpk0TFO+mLZrPT7LCtC948cHTogzGvkTsjsPtKmM7MYLZVVOClPrfd/TVMVUZOowB/Lu696B1jumvAB8BxmlFpE1mwAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.pipette.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMELQ/ypukxAjMgAAABtHXwAAAHV9I2gAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAAzElEQVQ4T73TWQ6DMBADUDuz5P43rtwGAnRCK1Wqv1iePIMA9C+C64UqPyNwO7jcmAHJoZYIZLOhVghszWOoCgGqcY8b9Fymue9FFXqNOhSVqIMWMU2JNM8OpkJgBGnTFAgMd6kbJBPhesIlAtNDRX2NZJ7Deu+7uSAwhWbHuHw6UU++mROSscIckUy+zzoh0PTGCjORdk4rzY5AM/dWmg1pVnrWZiAwm9X7KBvydc9AYJot9lGEyKa/Z2k2dGsGuiVjpw/m+j3V+TN6AED0HsLn17wiAAAAAElFTkSuQmCC";
        NS.localStorage.cursors.zoom.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMBtHXxAjMipuk0LQ/wAAAAAAAJ0P1poAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAAwklEQVQ4T73SQQ7EIAgFUD5Ivf+NJyKjlqJpZjF/ZegrbRCqL0KxkOVnREQA1sJy9goxM4ss7IGIuR9EhoqIuNaiqqWxrwqoGVU76lR3tJoy1QO5sU4pIq7t/SVdRXQz5Q1KO+FNJ0ht8xnRDbolRUF9zQlthklY1OZaCCymSrvj/IIJytcF8WbpqnRzARBLtnTD1ArLIBMRtLh5xtHROFq+lcUQgU+mI+BoDAFyNI5sPPHRTEdhLjH+TycSV2WTP6MPwZYfes+UJEAAAAAASUVORK5CYII=";
        NS.localStorage.cursors.export.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMBAjMkLQ/wAAACpukxtHXwAAAJvS9/YAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAA6klEQVQ4T63T0bKDMAgEUGAB//+POwloSCp3+nB38lI9sxhN6fohdF54y4+IanjLg85whQuJAHWpWayKIHv0zo4cNTbjujWJ7F1RYztCg45xEDG4+R9NY9wjnud+GfeQgr7HZdA1ld0BSEMv425jloqojuOFhnEPRUKlifkeF8ZlKhKhirIpyNjmUKQi3+OQYvqBsBQxq0p80xpSLEXMlrveQgqDINRE9ykrixQqIj7VcapXVHU+61B0nXczGFVjJ8zdX4rZ1TUOqnOLVBVZ2jdNk796tEyP1uftUbygTIeq6dBVTYu2/B/6AMgLFyDd/K5cAAAAAElFTkSuQmCC";
        NS.localStorage.cursors.fill.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAbUExURVdXVzAwMELQ/ypukxtHXxAjMgAAAP///wAAAHxXl2sAAAAJdFJOU///////////AFNPeBIAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuOWxu2j4AAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAMAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAo5MAAOgDAACjkwAA6AMAAFBhaW50Lk5FVCA1LjEuOQADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAABdUNkYj53BAQAAAQVJREFUOE+t09GOxCAIBVC4UOz/f/EE1FbQSWaTpQ9tyokKpXT/EFRfnOKviIiI19wTLyKOoMPazytiiF4hs1gQMTxvZrargbpxYsaoqqPVGGtVgZIxtqpe9BqryhExaBhVZmxqoDCqCmGzTXXkKVW0MLuaKAgk9trURGjd4KQChXJjdlQvEmH17EGNPrFGN+WsJuLrqWtRGTWwiq8T2UdVJAKI2ZVURRC/zNThUMgHb2D0pfzwOlSproG9CfPAEir1yb8wmBix1YDA3CyhO5Q3dNSYvt1EXY1G1CmIgYqHUFHYNk8v6ipmazEVufIBTaajm6Zx5WUlM9C8eRx+9CX7Pf4PfQBKLB14bePzUgAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.line.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMBAjMipukxtHX0LQ/wAAAAAAANOJ0/cAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAAnUlEQVQ4T9XSSw7DIAwEUI/twv1vHNlKWj5DyDKdDQiesBFIfRAZF1jejERyJoJ+P3MiASAiMRD1RaoBzO6Ra+QOpXIPs0FmC9Whjzkt2CD1zUkCU1PPG46kRRYOINUuFCcAClgps7p6ShQNMdU+cPRDVfcLYo+p+asQNSOiCJoVQ5OiaFQcDWqBKlB+aoVSbVE+1Dldo7ptvM/fogOKYx8gIOL+kwAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.paste.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXV0LQ/zAwMBtHXwAAABAjMipukwAAAKVBqPsAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAA4ElEQVQ4T43SURaEIAgFUHios/8dzwEx0chifgrvPLGi34eivZHVjmhvWHO7pUwtLSJiBm4sNtQADCA0beFa9xiAGUSL7KgbsCpmURrVQKWUAmEtEdhdgmqt1ROg1zVFlhIqR/b/WQ9o7DYqRxLqHekJw34PqAnCVB1hIH1K0oTFB8ySmu7EmrQccEtyJOtTcIQ5Eyux13NAnvKc1DTB1puOlaKZ0aRKOyDLYvu9oHPS+BZOM+kmWv2IOVLRxzmgPtS1Z47C16nj78iqn2zWilxFkKAQt9QNJcoXInqsT+gP8XgYsiK623MAAAAASUVORK5CYII=";
        NS.localStorage.cursors.copy.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMBAjMgAAABtHX0LQ/ypukwAAAP1iBOMAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAA2UlEQVQ4T83T2xLCMAgE0AJL/P8/drgkYkId35S+2TPLJh2vxxdz7T9080N05ZBPj6ZJVNQb4hixqSpRRCwEEZKXCrQ2xTYBC1nYhlCGyJJKrwMpQEyz1x0aIGa6QaoABhTsi2C9djRsk1qSn9CjDuR1LCyugcA9MsOsqrZSeF9HWTxv05OkQcMS/P2wWl0SvTIGGIPJvk6LPEv9aU5XUSbdoGi0OrXIltjEEQn+kTdkIuoE6pO81NrZo/nW+3N85BPlVc6k+l84L3OiBBWdc6BGFTPR5/lH9ASitRhPU7NBVAAAAABJRU5ErkJggg==";
        NS.localStorage.cursors.write.icon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAkCAMAAADW3miqAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAYUExURVdXVzAwMELQ/ypukxAjMgAAABtHXwAAAHV9I2gAAAAIdFJOU/////////8A3oO9WQAAAAlwSFlzAAAOwwAADsMBx2+oZAAAABh0RVh0U29mdHdhcmUAUGFpbnQuTkVUIDUuMS45bG7aPgAAALZlWElmSUkqAAgAAAAFABoBBQABAAAASgAAABsBBQABAAAAUgAAACgBAwABAAAAAwAAADEBAgAQAAAAWgAAAGmHBAABAAAAagAAAAAAAACjkwAA6AMAAKOTAADoAwAAUGFpbnQuTkVUIDUuMS45AAMAAJAHAAQAAAAwMjMwAaADAAEAAAABAAAABaAEAAEAAACUAAAAAAAAAAIAAQACAAQAAABSOTgAAgAHAAQAAAAwMTAwAAAAAF1Q2RiPncEBAAAA2UlEQVQ4T72TQRbDIAgFAYXe/8Z9kIofbPO6aXETceIQJfT4Iqgn3sUPISI6c33OHj3Zpiwio1MHNMbUeQ+x2FTVW8g3YjZtvgaJed3dVyEevszdVyBiGw51X4Vk+urhK1CU7ZBVH0LEdmmYq69Al+30IeS211P1AZS2w4eQ21YUH0B+khtC34aIbXqfqA+/5E0BJDMWVS0G+DZUbPU8E4p7q1BSCfE6ydcUv29BFDaEYKuEJLpkB0PpCdWNwpelLyjKBqb0S0LDCuOvZSah47+FDLbKx/gz9AR0rB3TYMAc4gAAAABJRU5ErkJggg==";
    });
})();