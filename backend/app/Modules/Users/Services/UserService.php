<?php

namespace App\Modules\Users\Services;

use App\Modules\Users\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Exception;

class UserService
{
    public function __construct(
        protected UserRepository $repository
    ) {}

    public function getAllUsers(array $filters)
    {
        return $this->repository->getAll($filters);
    }

    public function createUser(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        return $this->repository->create($data);
    }

    public function updateUser(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        $this->repository->update($user, $data);
        return $user->refresh();
    }

    public function deleteUser(User $user)
    {
        // Admin user protection logic could be handled here or in Policies
        if ($user->privilege_level === 1) {
            throw new Exception("Não é possível excluir um Administrador.");
        }
        
        return $this->repository->delete($user);
    }
}
