<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css">
        <link href="https://fonts.googleapis.com/css?family=Concert+One|Khand|Roboto+Condensed">
        <title>Simple Contact Manager</title>

        <!-- Fonts -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">

        {{-- <link rel="stylesheet" href="/css/app.css"> --}}
    </head>
    <body>
        <div id="root"></div>
        {{-- @auth
        <script>
            sessionStorage.setItem('id', {{ auth()->id() }});
        </script>
        @endauth --}}
        <script src="/js/index.js"></script>
    </body>
</html>