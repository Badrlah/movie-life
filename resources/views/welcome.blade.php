<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">

    <title>backend</title>
</head>
<body>

<div class="container">
    <table class="table table-bordered">
        <thead>
            <tr>
                <th>ID</th>
                <th>name</th>
                <th>email</th>
                <th>created_at</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($users as $user)
            <tr>
                <td>{{$user->id}}</td>
                <td>{{$user->name}}</td>
                <td>{{$user->email}}</td>
                <td>{{$user->created_at}}</td>
                <td>
                <a href="supprimer?id={{$user->id}}" class="btn btn-danger" onclick="return confirm('Voulez-vous vraiment supprimer cet élément ?')">Supprimer</a>

                <a href="modifier" class="btn btn-primary">Modifier</a>
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>


</body>
</html>
