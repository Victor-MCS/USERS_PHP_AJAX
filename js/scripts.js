$(document).ready(function () {
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../login.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                if (response === 'success') {
                    window.location.href = 'crud.html'; // Redirige a la vista CRUD
                } else {
                    alert('Credenciales incorrectas');
                }
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
                console.log('Datos del usuario recibidos:', user);

                if (user.error) {
                    alert(user.error);
                } else {
                    localStorage.setItem('userToEdit', JSON.stringify(user));

                    window.location.href = 'editar_usuario.html';
                }
            },
            error: function (xhr, status, error) {
                console.log('Error en la solicitud:', error);
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
                alert(response);
                loadUsers();
                $('#userForm')[0].reset();
            }
        });
    });

    // Actualizar usuario
    $('#editUserForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../editar_usuario.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                alert(response);
                window.location.href = 'crud.html'; // Redirige de vuelta a la vista de CRUD
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
