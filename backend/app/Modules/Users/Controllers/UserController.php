<?php

namespace App\Modules\Users\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Modules\Users\Services\UserService;
use App\Models\User;

class UserController extends Controller
{
    public function __construct(
        protected UserService $userService
    ) {}

    public function index(Request $request)
    {
        $user = auth('api')->user();

        // Usuário (3) só pode visualizar se desejar. Como segurança global (Regra).
        // Administrador (1) e Gerente (2) são livres para ler todos.
        
        $filters = $request->only(['search', 'sort_by', 'sort_dir', 'per_page']);
        return response()->json($this->userService->getAllUsers($filters));
    }

    public function store(Request $request)
    {
        $currentUser = auth('api')->user();
        if ($currentUser->privilege_level === 3) {
            return response()->json(['error' => 'Acesso negado. Usuários não podem cadastrar.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'privilege_level' => 'required|integer|in:1,2,3',
            'status' => 'required|string|in:active,inactive'
        ]);

        $user = $this->userService->createUser($validated);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user);
    }

    public function update(Request $request, User $user)
    {
        $currentUser = auth('api')->user();
        if ($currentUser->privilege_level === 3) {
            return response()->json(['error' => 'Acesso negado. Apenas gerentes ou administradores podem editar.'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,'.$user->code.',code',
            'password' => 'sometimes|string|min:6',
            'privilege_level' => 'sometimes|integer|in:1,2,3',
            'status' => 'sometimes|string|in:active,inactive'
        ]);

        $updated = $this->userService->updateUser($user, $validated);
        return response()->json($updated);
    }

    public function destroy(User $user)
    {
        $currentUser = auth('api')->user();

        if ($currentUser->privilege_level === 3) {
            return response()->json(['error' => 'Acesso negado. Usuários comuns não podem excluir.'], 403);
        }

        if ($currentUser->privilege_level === 2 && $user->privilege_level === 1) {
            return response()->json(['error' => 'Acesso negado. Gerentes não podem excluir administradores.'], 403);
        }

        try {
            $this->userService->deleteUser($user);
            return response()->json(null, 204);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }
}
