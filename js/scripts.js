$(document).ready(function () {
    localStorage.removeItem("loggedIn");

    // Logica de login con bloqueo al 3 intento de inicio de sesión incorrecto
    $('#loginForm').on('submit', function (e) {
        e.preventDefault();

        const maxAttempts = 3;
        let attempts = parseInt(localStorage.getItem('loginAttempts')) || 0;
        const lockoutDuration = 10 * 1000;

        const lockoutEnd = localStorage.getItem('lockoutEnd');
        if (lockoutEnd && new Date() < new Date(lockoutEnd)) {
            const remainingTime = Math.ceil((new Date(lockoutEnd) - new Date()) / 1000);
            $('#messageModalLabel').text('Bloqueo de sesión');
            $('#messageModalBody').text('Demasiados intentos fallidos. Inténtalo de nuevo en ' + remainingTime + ' segundos.');
            $('#messageModal').modal('show');
            return;
        }

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
                    $('#messageModalBody').text('Redirigiendo a la vista Usuarios');
                    localStorage.setItem('loggedIn', 'true');
                    localStorage.removeItem('loginAttempts');
                    setTimeout(function () {
                        window.location.href = 'usuarios.html';
                    }, 2000);
                } else {
                    attempts++;
                    localStorage.setItem('loginAttempts', attempts);

                    if (attempts >= maxAttempts) {
                        const lockoutEnd = new Date(new Date().getTime() + lockoutDuration);
                        localStorage.setItem('lockoutEnd', lockoutEnd);

                        $('#messageModalLabel').text('Demasiados intentos fallidos');
                        $('#messageModalBody').text('Has alcanzado el límite de intentos. Inténtalo de nuevo en 10 segundos.');
                    } else {
                        $('#messageModalLabel').text('Credenciales incorrectas');
                        $('#messageModalBody').text('El nombre de usuario o la contraseña no son correctos. Intento ' + attempts + ' de ' + maxAttempts + '.');
                    }
                }
            },
            error: function () {
                $('#messageModalLabel').text('Error');
                $('#messageModalBody').text('Hubo un problema con la solicitud. Intenta de nuevo más tarde.');
            }
        });
    });

    // Logica para la carga de los usuarios, opté por separarlos en activos e inactivos para aplicar borrado logico y fisico
    function loadUsers() {
        $.ajax({
            url: '../obtener_usuarios.php',
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                if (data.error) {
                    alert(data.error);
                } else {
                    let activeUsersHtml = '<table class="table table-striped text-white"><thead><tr><th>ID</th><th>Nombre de Usuario</th><th>Correo</th><th>Status</th><th>Palabra clave</th><th>Acciones</th></tr></thead><tbody>';
                    let inactiveUsersHtml = '<table class="table table-striped text-white"><thead><tr><th>ID</th><th>Nombre de Usuario</th><th>Correo</th><th>Status</th><th>Palabra clave</th><th>Acciones</th></tr></thead><tbody>';

                    data.forEach(user => {
                        let status = user.status == 1 ? "Activo" : "Inactivo";
                        let userRow = `<tr  class="text-white">
                            <td>${user.id}</td>
                            <td>${user.username}</td>
                            <td>${user.email}</td>
                            <td>${status}</td>
                            <td>${user.answer}</td>
                            <td>
                                <button class="btn btn-info btn-sm" onclick="editUser(${user.id})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Borrado físico</button>
                                <button class="btn btn-dark btn-sm" onclick="inactiveUser(${user.id})">Borrado o Activado lógico</button>
                            </td>
                        </tr>`;
                        if (user.status == 1) {
                            activeUsersHtml += userRow;
                        } else {
                            inactiveUsersHtml += userRow;
                        }
                    });

                    activeUsersHtml += '</tbody></table>';
                    inactiveUsersHtml += '</tbody></table>';

                    $('#activeUsersList').html(activeUsersHtml);
                    $('#inactiveUsersList').html(inactiveUsersHtml);
                }
            },
            error: function (xhr, status, error) {
                alert('Error al cargar usuarios: ' + error);
            }
        });
    }

    // Logica para obtención de usuario para despues editarlo
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

    // Logica para agregar usuarios
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


    // Logica para editar el usuario
    $('#editUserForm').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            url: '../editar_usuario.php',
            type: 'POST',
            data: $(this).serialize(),
            success: function (response) {
                console.log(response)
                $('#messageModalLabel').text('Edición de usuario exitosa');
                $('#messageModalBody').text(response);
                $('#messageModal').modal('show');
                setTimeout(function () {
                    window.location.href = 'usuarios.html';
                }, 2000);
            }
        });
    });


    // Logica para recuperación de contraseña
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


    // Logica para eliminado fisico
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

    // Logica para eliminado / activación logica
    window.inactiveUser = function (id) {
        if (confirm('¿Estás seguro de que deseas modificar el estatus a este usuario?')) {
            $.ajax({
                url: '../desactivar_usuario.php',
                type: 'POST',
                data: { id: id },
                success: function (response) {
                    alert(response);
                    loadUsers();
                }
            });
        }
    };


    if (window.location.pathname.includes('usuarios.html')) {
        loadUsers();
    }
});
