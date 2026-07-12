<?php

namespace App\Modules\Users\Repositories;

use App\Models\User;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    public function getAll(array $filters): LengthAwarePaginator
    {
        $query = User::query();

        // Identifica o termo para busca (Instantânea)
        if (!empty($filters['search'])) {
            $query->where('name', 'ilike', '%' . $filters['search'] . '%')
                  ->orWhere('email', 'ilike', '%' . $filters['search'] . '%')
                  ->orWhere('code', 'ilike', '%' . $filters['search'] . '%');
        }

        // Identifica ordenação
        $sortBy = $filters['sort_by'] ?? 'code';
        $sortDir = $filters['sort_dir'] ?? 'asc';
        $validColumns = ['code', 'name', 'email', 'privilege_level', 'status', 'created_at', 'updated_at'];
        
        if (in_array($sortBy, $validColumns)) {
            $query->orderBy($sortBy, $sortDir === 'desc' ? 'desc' : 'asc');
        }

        // Paginação
        $perPage = $filters['per_page'] ?? 10;
        return $query->paginate($perPage);
    }

    public function findById(int $id): ?User
    {
        return User::where('code', $id)->first();
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(User $user, array $data): bool
    {
        return $user->update($data);
    }

    public function delete(User $user): bool
    {
        return $user->delete();
    }
}
