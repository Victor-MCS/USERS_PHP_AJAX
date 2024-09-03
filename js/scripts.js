$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        $('#messageModalLabel').text('Iniciando sesión');
        $('#messageModalBody').text('Por favor, espera mientras verificamos tus credenciales...');
        $('#messageModal').modal('show');

        $.ajax({
            url: '../login.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                if (response === 'success') {
                    $('#messageModalLabel').text('Inicio de sesión exitoso');
                    $('#messageModalBody').text('Redirigiendo a la vista CRUD...');
                    localStorage.setItem('loggedIn', 'true');
                    setTimeout(function () {
                        window.location.href = 'crud.html';
                    }, 2000);
                } else {
                    $('#messageModalLabel').text('Credenciales incorrectas');
                    $('#messageModalBody').text('El nombre de usuario o la contraseña no son correctos.');
                }
            },
            error: function () {
                $('#messageModalLabel').text('Error');
                $('#messageModalBody').text('Hubo un problema con la solicitud. Intenta de nuevo más tarde.');
            }
        });
    });


    // Cargar usuarios
    function loadUsers() {
        $.ajax({
            url: '../obtener_usuarios.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    alert(data.error);
                } else {
                    let html = '<table border="1"><tr><th>ID</th><th>Nombre de Usuario</th><th>Acciones</th></tr>';
                    data.forEach(user => {
                        html += `<tr>
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>
                                <button onclick="editUser(${user.id})">Editar</button>
                                <button onclick="deleteUser(${user.id})">Eliminar</button>
                            </td>
                        </tr>`;
                    });
                    html += '</table>';
                    $('#usersList').html(html);
                }
            },
            error: function (xhr, status, error) {
                alert('Error al cargar usuarios: ' + error);
            }
        });
    }

    window.editUser = function (id) {
        $.ajax({
            url: '../obtener_usuario.php',
            type: 'POST',
            data: { id: id },
            dataType: 'json',
            success: function (user) {
                if (user.error) {
                    alert(user.error);
                } else {
                    localStorage.setItem('userToEdit', JSON.stringify(user));

                    window.location.href = 'editar_usuario.html';
                }
            },
            error: function (xhr, status, error) {
                alert('Error al cargar los datos del usuario: ' + error);
            }
        });
    };

    $('#userForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../agregar_usuario.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                $('#messageModalLabel').text('Resultado');
                $('#messageModalBody').text(response);
                $('#messageModal').modal('show');

                loadUsers();
                $('#userForm')[0].reset();
            }
        });
    });

    $('#forgotUserForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../recuperar_contrasena.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                console.log(response);
                const user = JSON.parse(response);

                if (user && !user.error) {
                    console.log(user.username);
                    localStorage.setItem('usernameForPasswordReset', user.username);
                    window.location.href = 'cambiar_contrasena.html';
                } else {
                    alert(user.error || 'Credenciales incorrectas.');
                }
            },
            error: function (xhr, status, error) {
                console.log('Error en la solicitud AJAX:', error);
                alert('Hubo un problema con la solicitud.');
            }
        });

    });


    $('#editUserForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../editar_usuario.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                alert(response);
                window.location.href = 'crud.html';
            }
        });
    });


    window.deleteUser = function (id) {
        if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            $.ajax({
                url: '../eliminar_usuario.php',
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    alert(response);
                    loadUsers();
                }
            });
        }
    };


    if (window.location.pathname.includes('crud.html')) {
        loadUsers();
    }
});
