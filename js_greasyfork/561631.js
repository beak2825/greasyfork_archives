// ==UserScript==
// @name         CoD Hitmarker (Call of Duty)
// @namespace    http://tampermonkey.net/
// @version      2026-01-07
// @description  Makes funny noises when you click and adds a hitmarker
// @author       opctim
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/561631/CoD%20Hitmarker%20%28Call%20of%20Duty%29.user.js
// @updateURL https://update.greasyfork.org/scripts/561631/CoD%20Hitmarker%20%28Call%20of%20Duty%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hitmarkerSrc = "data:application/ogg;base64,T2dnUwACAAAAAAAAAABlm6cwAAAAAFOySb4BHgF2b3JiaXMAAAAAAYC7AAAAAAAAwNQBAAAAAAC4AU9nZ1MAAAAAAAAAAAAAZZunMAEAAAB/dS3hD2v/////////////////6AN2b3JiaXM0AAAAWGlwaC5PcmcgbGliVm9yYmlzIEkgMjAyMDA3MDQgKFJlZHVjaW5nIEVudmlyb25tZW50KQIAAAAJAAAAREFURT0yMDIwFgAAAFNvZnR3YXJlPUxhdmY2MC4xNi4xMDABBXZvcmJpcylCQ1YBAAgAAAAxTCDFgNCQVQAAEAAAYCQpDpNmSSmllKEoeZiUSEkppZTFMImYlInFGGOMMcYYY4wxxhhjjCA0ZBUAAAQAgCgJjqPmSWrOOWcYJ45yoDlpTjinIAeKUeA5CcL1JmNuprSma27OKSUIDVkFAAACAEBIIYUUUkghhRRiiCGGGGKIIYcccsghp5xyCiqooIIKMsggg0wy6aSTTjrpqKOOOuootNBCCy200kpMMdVWY669Bl18c84555xzzjnnnHPOCUJDVgEAIAAABEIGGWQQQgghhRRSiCmmmHIKMsiA0JBVAAAgAIAAAAAAR5EUSbEUy7EczdEkT/IsURM10TNFU1RNVVVVVXVdV3Zl13Z113Z9WZiFW7h9WbiFW9iFXfeFYRiGYRiGYRiGYfh93/d93/d9IDRkFQAgAQCgIzmW4ymiIhqi4jmiA4SGrAIAZAAABAAgCZIiKZKjSaZmaq5pm7Zoq7Zty7Isy7IMhIasAgAAAQAEAAAAAACgaZqmaZqmaZqmaZqmaZqmaZqmaZpmWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWZZlWUBoyCoAQAIAQMdxHMdxJEVSJMdyLAcIDVkFAMgAAAgAQFIsxXI0R3M0x3M8x3M8R3REyZRMzfRMDwgNWQUAAAIACAAAAAAAQDEcxXEcydEkT1It03I1V3M913NN13VdV1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVWB0JBVAAAEAAAhnWaWaoAIM5BhIDRkFQCAAAAAGKEIQwwIDVkFAAAEAACIoeQgmtCa8805DprloKkUm9PBiVSbJ7mpmJtzzjnnnGzOGeOcc84pypnFoJnQmnPOSQyapaCZ0JpzznkSmwetqdKac84Z55wOxhlhnHPOadKaB6nZWJtzzlnQmuaouRSbc86JlJsntblUm3POOeecc84555xzzqlenM7BOeGcc86J2ptruQldnHPO+WSc7s0J4ZxzzjnnnHPOOeecc84JQkNWAQBAAAAEYdgYxp2CIH2OBmIUIaYhkx50jw6ToDHIKaQejY5GSqmDUFIZJ6V0gtCQVQAAIAAAhBBSSCGFFFJIIYUUUkghhhhiiCGnnHIKKqikkooqyiizzDLLLLPMMsusw84667DDEEMMMbTSSiw11VZjjbXmnnOuOUhrpbXWWiullFJKKaUgNGQVAAACAEAgZJBBBhmFFFJIIYaYcsopp6CCCggNWQUAAAIACAAAAPAkzxEd0REd0REd0REd0REdz/EcURIlURIl0TItUzM9VVRVV3ZtWZd127eFXdh139d939eNXxeGZVmWZVmWZVmWZVmWZVmWZQlCQ1YBACAAAABCCCGEFFJIIYWUYowxx5yDTkIJgdCQVQAAIACAAAAAAEdxFMeRHMmRJEuyJE3SLM3yNE/zNNETRVE0TVMVXdEVddMWZVM2XdM1ZdNVZdV2Zdm2ZVu3fVm2fd/3fd/3fd/3fd/3fd/XdSA0ZBUAIAEAoCM5kiIpkiI5juNIkgSEhqwCAGQAAAQAoCiO4jiOI0mSJFmSJnmWZ4maqZme6amiCoSGrAIAAAEABAAAAAAAoGiKp5iKp4iK54iOKImWaYmaqrmibMqu67qu67qu67qu67qu67qu67qu67qu67qu67qu67qu67qu67pAaMgqAEACAEBHciRHciRFUiRFciQHCA1ZBQDIAAAIAMAxHENSJMeyLE3zNE/zNNETPdEzPVV0RRcIDVkFAAACAAgAAAAAAMCQDEuxHM3RJFFSLdVSNdVSLVVUPVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdU0TdM0gdCQlQAAGQAAZMH3IIQQDqPUQjBBaMxBBqnkoEFJpdXWg+YQM4w575WEkklKPVjOQcSQ8yAhxxRjSmkrLWXUGMFA59xx5RAEQkNWBABRAACAMYYxxBhyzknJpETOMSmdlMg5R6WT0kkpLZYYMyklthJj5Jyj0knKpJQYS4sdpRJjia0AAIAABwCAAAuh0JAVAUAUAABiDFIKKYWUUs4p5pBSyjHlHFJKOaacU845CB2EyjEGnYMQKaUcU84p5xyEzEHlnIPQQSgAACDAAQAgwEIoNGRFABAnAOCQHM+TNEsUJUsTRU8UZdcTTVeWNM0UNVFUVcsTVdVUVdsWTVW2JU0TRU30VFUTRVUVVdOWTVW1bc80bdlUXd0WVVW3Zdv2fVe2hd8zTVkWVdXWTdW1ddeWfV+2dV2YNM00NVFUVU0UVdV0Vd02Vde2NVF0XVFVZVlUVVlWZdkWVlnWfUsUVdVTTdkVVVWWVdn1bVWWfd90XV1XZdn3VVn2ddsXhuX2faOoqrZuyq6vq7Ls+7Zu823fN0qaZpqaKLqqJoqqa6qqbpuqa9uWKKqqqKqy7JmqK6uyLOyqK9u6JoqqK6qqLIuqKsuq7Pq+Ksu6Laqqrauy7OumK/u+7vvYsu4bp6rquirbvrHKsq/rvq+0dd33PdOUZdNVfd1UVV+Xdd8o27owjKqq66os+8Yqy76w+z668RNGVdV1VXaFXZVtX9iNnbD7vrHMus24fV85bl9Xlt9Y8oW4ti0Ms28zbl83+savDMcy5JmmbYuuquum6urCrOvGb/u6MYyq6uuqLPNVV/Z13fcJu+4bw+iqurDKsu+rtuz7uu4by2/8uLbNt32fMdu6T/iNfF9YyrYttIWfcuu6sQy/ka78CAAAGHAAAAgwoQwUGrIiAIgTAGAQck4xBaFSDEIHIaUOQkkVYxAy56RUzEEJpbQWQkmtYgxC5ZiEzDkpoYSWQiktdRBSCqW0FkppLbUWa0otxg5CSqGUlkIpraWWYkytxVgxBiFzTErGnJRQSkuhlNYy56R0DlLqIKRUUmqtlNRixZiUDDoqnYOSSioxlZRaC6W0VkqKsaQUW2sx1tZiraGU1kIprZWUYkwt1dZirLViDELmmJSMOSmhlJZCKalVjEnpoKOSOSippBRbKSnFzDkpHYSUOggplVRiKym1FkppraQUWyilxRZbrSm1VkMprZWUYiwpxdhiq7XFVmMHIaVQSmuhlNZSazWm1mIMpbRWUoqxpBRbi7HW1mKtoZTWQiqxlZJaTLHV2FqsNbUWY2qx1hZjrTHW2mOtvaeUYkwt1dharDnW1mOtNfcOQkqhlNZCKa2l1mpMrcUaSmmtpBJbKKnFFlutrcVYQymtlZRaLCnF2GKrtcVYa2otxhZbrSm1WGOuPcdWY0+txdhirLW1VmusNedYY68FAAAMOAAABJhQBgoNWQkARAEAEIQoxZyUBiHHnKOUIMSYg5QqxyCU0lrFHJRSWuuck9JSjJ2DUlKKsaTUWoy1lpRai7HWAgAAChwAAAJs0JRYHKDQkJUAQBQAAGIMQoxBaJBRyjEIjUFKMQYhUoox56RESjHmnJTMMeckpJQx5xyUlEIIpaTSUgihlJRSKwAAoMABACDABk2JxQEKDVkRAEQBAADGIMYQYwg6ByGTEjnIoHQQGgghlU5KRqWUVlrLpJSWSmsRhE5KSCmjUlorqWWSSmullQIAwA4cAMAOLIRCQ1YCAHkAAIgxSjHmnHMGIaUcc845g5BSzDnnnGKKMecghFApxphzEELIHHMOQgghZMw5ByGEEDrnIIRQQgidcxBCCCGUzjkIIZRQSucchBBCKaUAAKACBwCAABtFNicYCSo0ZCUAkAcAABijlHNSUmqUYgxCKq1FCjEGoaTWKsack5JSjBVjzklJLcYOQikptVZrB6GUlFqrtZSSUmy15lxKaS3GWnNOrcVYa649p9ZirDXn3AsAwF1wAAA7sFFkc4KRoEJDVgIAeQAADEJKMcYYY0gpxhhjjDGklGKMMcaYYowxxhhzTjHGGGOMOccYY8wx55xjjDHGnHPOMcYYc8455xhjjDnnnHOMMeecc845xphzzjnnnAAAoAIHAIAAG0U2JxgJKjRkJQCQBwAAECKllFJKaaSUUkoppTRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKaWUUkoppZRSSimllFJKKSWEEEIIIYQQCgBxvHAA9JmwUWRzgpGgQkNWAgCpAACAMQo5BZ2EVBqlnIOQSkopNUo5JyGllFKrnJOSUmuxxVg5JyWl1lqssZOSUou11ppzJyW1FmOtteaQUoy15tpz0CGlFmvNNefcS2ux5pxzDz6Y2GKtvfeee1Ax1lyD7kEIoWKsOecchA++AACTCAcAxAUbVkc4KRoLLDRkFQAQAwAwBABBKJoBAIAJDgAAAVawK7O0aqO4qZO86IPAJ3TEZmTIpVTM5ETQIzXUYiXYoRXc4AVgoSErAQAyAAAEasy1x1gjxJiDVFouFVIKSom9VEopB6HlmimFlHKWS8eYYoxRrCV0SBkErYTQKYWIopZaK6FDyEnKMcbWKQYAAIAgAMBAhMwEAgVQYCADAA4QEqQAgMICQ8dwERCQS8goMCgcE85Jpw0AQBAiM0QiYjFITKgGiorpAGBxgSEfADI0NtIuLqDLABd0cdeBEIIQhCAWB1BAAg5OuOGJNzzhBifoFJU6CAAAAAAABAB4AABINoCIiGjmODo8PkBCREZISkxOUAIAAAAAAAgAPgAAkhQgIiKaOY4Ojw+QEJERkhKTE5QAAAAAAAAAAAAgICAAAAAAABAAAAAgIE9nZ1MABOkZAAAAAAAAZZunMAIAAABe6cKHI2FaUy0tLV9bV2hqcnJza2xUYV9WOjNZUTExNDJWXP8W7vjqvB2DAYKpl0yqyw5Qv+Kdcz7+c+UarkbH0Trnt0PX4deho64jR39WrgQlEuRt+b2feHzPf1UKkvdD1NCXl25cG7fmw6Z1nzeGpzAP7G5Jw6a85HC+plkeF39++H1Ut/wXBsQVpQNK5Mn1rvpnLj+d/aqL/R2foi/eDvfDU5evXRzWvMUDhttzy3OoG2D9mo4N0ZuQOHoL99S8qx2k8OXuYTfirjx0bi/E8Zcr1/Ax6aaB1UIpWfbSd9RrAZQRkcRWCF3bZvL809XosuvJ67mf6b4ajq/zczwcdhyvyquqUvRWuQ39DCl5G1mkudJ7yc+VJ+r8NiAPA2vYkpS/QVRiAACcmoFkYScjvMkB4A0AtAF1KJCkKptG+SkEKOQUG+YfIrUVI17vvBWr8eqv4crWXsYw+Fgl26t4KsEDpAl9KEC2C5ISrhwnEAUB0IzDZDfWViPabxHAKu/9g38aREOlNQgiNAhpx8AvzAk9DGSNLCIVlO9iA5YIrg7qH50MN/VCJeum3FKzUtvAXeNUEGO0J7/pYZpixB0DAY58DJzuap/tNX85POc8Xx2Pw5/dfZbzWx1nhTXap5rT29HavzR8poPGw+z389QdFhUsqM9u6jzQmfM3fO8d3lF7n9TVQGN0epDSojw6/121tX+K/+Zq9yvECQTEFaOeWrW/1sdSLb7P40/j8kPFa94/VdZXjyIqz6v1eoeOFv+yyHqJYRgdAOVrRGn/+aBuA3fBztn8MV/7Obe3cW5r0pmaue//SEeqDmo20f5ul8QEVayrrZAE7FF5kQQJT5Wl3n2/3tfHq1HRo2cdfpqUrw975+ttr1/MOtaPg/KMj1e8bVUBlGw5S3PDpCasaP5KrF/m2NyZouAEWxbG2ZF03h1iw9uBm35UrVSmwgAAHHppn22onvpkH3WAw/f38/ux92+XiH21f3zWtfVH1vqwy6781hXv0kIaDaFhIDVzN397dYZtj5JYnNq4rbOzJNedZ0pEYXOR5PEm/XqcNbaOvv3+yvYBjErxeM0ez+JwmwyH/W8TPgfEggmiAxDgX736eL1yx+FYlfevPofruLpX9bj/10+17p3DPY8zc+0+dmui+hYhYNuSB9bDz3nZoM+/1FtoZC6LasNkv/wzqFQVljJldRp+P/paxd+ogo+9ffXnrDM93ncyO/ts0+Rofl4N3HoJQlGgoDTe9bXL82qVANcx6UZd11c3/KLXIYf9ZdVZrLmzZvWhjkqp7bte1YryNe5q6wtM1xnXVO/V6HbtjRck8VTxdTsgGQ93K72BuVdnmGCk+RXXStf/13z8/9f/m797S3wm9js7/uXDoT5fvrEFvHoRAAyVktU+3z6rYjL3FZ8Xrz0xvsufiVXG5F3Fq5/PJ9h13dEe27+VS3/IAfuPPim7zROtGX0kLdh8JvG9eR1VnZtbDjX7fxz+Dp4OHZKJncfj/ivdf34f9Tx5+df/0pXPOgfl4eOu94Hov7wkgbwU3H4hAMeYFbFaB1h/uPHn6tf38THEqOJ4yHGWMsbx9ucvjd3m3HPIqFLbSneZ064YcqG7Xcmb1OwmUTe85jWNot/4Ps+R0d555/Go6tKD89mw6jXxcPrNc93386vbr//t9/8v+W2Xw+/p+Xz0+33d8PXPGtyKOQSGE9jcDnBbD6/6+IpHh/nm4fPU5TjueVF39dp1PPfjNi+KcSZcXwBCwDgy3sODyrvuZGQomxoX+GiugCi6Mo+Jg1uD3ufYevr4UfZd6OHZr0rmer+9x+X+OVF6bs/BvpY/703zPrRT5IqJAdJVFFO6Nv7cTzc65PTyAvgSrx7+rnJkncWuL7fxZ//6cpie6tVCCl90X+HhMVqU7AjmknQIOS6e2y+Suj4Oot/l/+l+4n/jr+f6jFur+qO/38cPVkh8yOvRTYvz+7Q5qf++odpNljQBnHJ1QAMAoPJrUW/yV+O+tWKYIy5+/RqKhu+3qMD2LbYsZnny94nD/pcOP93kgc8p1Mj3NmrzdvmLyb9fV7afflbDyyfekg5RycHWeCQZtNtpFYoNvGIJBE04EPrfcBb98azpbXGJ19f8s4fs+/tdvXtcGpX74zkzcvj6h/vNQADv+nOu1rd8s5zddrrWvdxmM2y9/R3/f+VoVv4kDdTVw3bz9HI5xJ0LmIsrB867CRwxTieYAZReESMYyDWiO/WY6hvHXL49x69z0cM/95x/Fd9/d67xcTq9z9b0Y/aKHO+/sgHcMVQQ4hpddTatZfrA6TN6ek9LXtqf672uxWDk5nZ9ZnVQ7rZA7WFSFEoQT5IBD2IArFaxFF1yEv6rPx4X0+dVXH/aeT38UwwfLvHOedP4ZBVZyonnXPeQ43r9BYBb0my8JzqJ9UFNrtbuzBb3F6IKlZ2H4GZyPv3vLHnxXytqKDAODdYJAAAUTssDZgQMMLtmALAxdmMAKAP4bV+7OxqnDA0qlouc998aAKAo/Vx7CFFETLyI/3y5iT8aMdPcjvwZPEoLaBlVRAMSaQugOS4BNYA4fkkEAOV3V1BFsqq5ouB4h7Mk5aWPtrfmab5OH+df/gEdJFIRbo6uqEKF6gDl3tffMR1+xvNa1fK+j3k4htfrrHsN/2U93xOAJi00WHZDuMeohI673+W99OK/+J9Y3zqZjmc0rlBoAx/3YQAAuMefSfHOr/9bPC62nxpcWhvWjaSmT0rFueq36a7uy66nx8wfv2++x7CGrs+dS7zOMAw+DfX8JICbT5r0oAPLOtkopVNqFiGQZfRXg6tmXsMsAjlFGHQCfhX/q2UCAAAEUgsg3aaBxiORtgBKHAqgHKCgwgLAQtvFwjUaZmJmnjcWPpuyKjq3EnZG5Wo5nVUOFFZpytkAEnZNAJpDAsoA9eM1AgB0TdPONGiKKjgy0u/2k7W52OLTL4QV8aXnI+nneRRevdi0nUnISsHEaQZgEmUNUAbII7EjAxW8LxkAmlUqFkHJqiJu3Ff9LV5tfOOkkAakB2/8WQUIAACJtAXQClIA5QBTYccAUA26rvpILApE0WN+GPH8w46pWy/LIvsPvtsEEf/OACxihwlRcOB4HWD4haGP0/r7qG7Xsvupc2v1mlMb51YOBGuac6lN5RsOvsqyO1O4O+aTwubUMO0mvHjTmKu97EQPtReLFx9ltnp8rbxJm+vfzndzTrILPGbXaCJVcSPo9DpA3DDs+6q81HXOkeNhLWnsP3av+9wxrCJmQKkgjONQffOhkDubyQX/qmve+PX5sPi9eC6xNdUoRgfkvU+6Z5h0uN3W5c+0OUs9r+/XWVNCSQD6+JwW3YLboIdahk0AgM9SPtrHqvUMTgxwVFU5Z5IhUgAJANjy7tRRzfPfV5dbn930ebrxyP/iVlqfuE1lbL51f53OtV3xsCs0FMIPqre2y9u1Gqu6Wc/Oh/Wmvs276JXOulMY631b+1f0ox7Dn3u//4v+pPJALLshF0pOUeJ4j3jo6jHyODhI9RQetp/wqY5WTNEHO2pVm7olOdWHrR9rKHLa1v6eKgjj8kWm1AzqYjeYxvHl+Wt1LfUsxcnJ4MMNGy9L3UexK4QgRalOELNTrEGx58gzapNA+AwRJV2GbSFt53TXkCajbJlVa+9NH1tn4PetW1u4+VXhf28Q04jVSy2p0qgtNLkqlV2zhMvA2x+AKBkAXsiMRkTCNMiQk5xVXWgWeq0VgKoKB07oTmcMwGP0lCI+Xo0aEhadv7tcZF8/T3T85s99/SWloplH9BKNNN3UHwncr7joCPjV1H/WszO2OS9dYqKl4e/PPffPeK2s8BDVNp/LJHsi2mHNC4HgeGYG03RGWTD6N9xb3n2BXbJNu3VZ59E1q1pHhHTNfsKvb6X6iheTK/AFj513b6likrb9FgE7c+yNfLgCclyf3VLzPQ8SNcbB8GHQMlOZdvtJLCesQVYSJ1Gb0OmIm1OIPJqeEDlzWZ1hEGO5LVuhSIkLUpB/2mvAMaofUPN1TEIAAF54jF4HCNBBjmheI+eADGyzpgIZIOtAeSl2JFsOAGMAcL2MlyKD0TmvXVC1VOnXLvJ5uqenk8N6tCRupbLR0PvVsdsXCvJbSZxrxVZa0RiFqE8AAJZccPOrgXbtRsUb4qx44OpGyO39Dl/Ge/i9R0yxaNCM1Ivdrt/Hl9uumaGVtK/f1URsKRGWooalasruH+8Ras4yKqnjcEgNexuNZXYCFq2/SLy7r3h9mOYGO4oS+8cimSq5r1Uq2anpUhWF28Hukzda3zmA7uYq9qs4//Lxs7NEr7MGVj/oxOXlB6ysDaUedQE5Eb7XfoFC8+Ak4tzVlFtQgwUkPjaMraVcQZIRVxn/I+7zbUigMkCVMwmFMwEAi1bPfMbG+0vmqedC71z1oxMrH91WwlyfzSVzdfZs5ersWX1rngqtG4la8XDFQ8wtnuURj+W9Opb32hb8oXiU68Isf1f82n3RYQKe5J5rLR55Tc5Vc/ghFm1NM1fBOQ/9tH0Rvyp/Vzyq91ov+IjHon0Jnsq1mMOsmtXv6IIRMqnI6vIpfzUg0gbv1X1/qs+kvM7HrLNyrBxr8GHw22sHkE0KU3rDL0D2uxNPzo3wErdfY3gmhUlBNpFupFpVkTUWs1muHXmLAqQBAAAGnAYB";

    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    let buffer = null;
    let decoding = false;

    // Optional: block double-trigger / overlap spam
    let lastPlay = 0;
    const COOLDOWN_MS = 40; // tweak 30–80

    // ===== CURSOR SETUP =====

    const cursorDataUri = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiPgogICAgPCEtLSB0b3AgYXJtLCB0aGVuIHJvdGF0ZWQgNCB3YXlzIC0tPgogICAgPHJlY3QgeD0iOTQiIHk9IjE1IiB3aWR0aD0iMTIiIGhlaWdodD0iNzAiIHJ4PSIxMyIKICAgICAgICAgIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIgogICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoNDUgMTAwIDEwMCkiIC8+CgogICAgPHJlY3QgeD0iOTQiIHk9IjE1IiB3aWR0aD0iMTIiIGhlaWdodD0iNzAiIHJ4PSIxMyIKICAgICAgICAgIGZpbGw9IiNmZmYiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIzIgogICAgICAgICAgdHJhbnNmb3JtPSJyb3RhdGUoMTM1IDEwMCAxMDApIiAvPgoKICAgIDxyZWN0IHg9Ijk0IiB5PSIxNSIgd2lkdGg9IjEyIiBoZWlnaHQ9IjcwIiByeD0iMTMiCiAgICAgICAgICBmaWxsPSIjZmZmIiBzdHJva2U9IiMwMDAiIHN0cm9rZS13aWR0aD0iMyIKICAgICAgICAgIHRyYW5zZm9ybT0icm90YXRlKDIyNSAxMDAgMTAwKSIgLz4KCiAgICA8cmVjdCB4PSI5NCIgeT0iMTUiIHdpZHRoPSIxMiIgaGVpZ2h0PSI3MCIgcng9IjEzIgogICAgICAgICAgZmlsbD0iI2ZmZiIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjMiCiAgICAgICAgICB0cmFuc2Zvcm09InJvdGF0ZSgzMTUgMTAwIDEwMCkiIC8+Cjwvc3ZnPg==";

    // Hotspot (center of cursor)
    const CURSOR_X = 25;
    const CURSOR_Y = 25;

    // How long cursor stays changed (ms)
    const CURSOR_MS = 20;

    let cursorTimer = null;
    let fireInterval = null;
    let initialDelayTimer = null;
    const RAPID_FIRE_DELAY = 200;

    const style = document.createElement('style');
    style.innerHTML = `html.hitmarker { cursor: url("${cursorDataUri}") ${CURSOR_X} ${CURSOR_Y}, auto !important; }`;

    document.body.appendChild(style);

    // Flash cursor briefly
    function flashCursor() {
        document.documentElement.classList.add('hitmarker');

        clearTimeout(cursorTimer);

        cursorTimer = setTimeout(() => {
            document.documentElement.classList.remove('hitmarker');
        }, CURSOR_MS);
    }

    function fireShot() {
        flashCursor();

        if (!buffer) return;

        const now = performance.now();
        if (now - lastPlay < COOLDOWN_MS) return;
        lastPlay = now;

        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.connect(ctx.destination);
        src.start(0);
    }

    // ===== AUDIO SETUP =====

    function dataUriToArrayBuffer(dataUri) {
        const base64 = dataUri.split(",")[1];
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async function unlockAndDecodeOnce() {
        if (buffer || decoding) return;
        decoding = true;

        if (ctx.state !== "running") {
            await ctx.resume();
        }

        const arr = dataUriToArrayBuffer(hitmarkerSrc);
        buffer = await ctx.decodeAudioData(arr);

        decoding = false;
    }

    document.addEventListener(
        "pointerdown",
        () => {
            unlockAndDecodeOnce().catch(() => {});
        },
        { once: true }
    );

    // Rapid fire logic
    document.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return; // Nur linke Maustaste

        // Ersten Schuss sofort abfeuern (Single Shot)
        fireShot();

        // Falls noch alte Timer laufen, sicherheitshalber löschen
        clearTimeout(initialDelayTimer);
        clearInterval(fireInterval);

        // Prüfen, ob die Taste gehalten wird
        initialDelayTimer = setTimeout(() => {
            // Wenn nach RAPID_FIRE_DELAY noch gedrückt ist, Dauerfeuer starten
            fireInterval = setInterval(fireShot, COOLDOWN_MS + 5);
        }, RAPID_FIRE_DELAY);
    });

    const stopFiring = () => {
        clearTimeout(initialDelayTimer);
        clearInterval(fireInterval);
        fireInterval = null;
    };

    document.addEventListener("mouseup", stopFiring);
    document.addEventListener("mouseleave", stopFiring);
})();