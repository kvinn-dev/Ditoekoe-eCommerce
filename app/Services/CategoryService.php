<?php

namespace App\Services;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CategoryService
{
    public function getPaginated()
    {
        return Category::withCount('products')
            ->with('parent')
            ->latest()
            ->paginate(15);
    }

    public function getParentsExcept(?int $excludeId = null)
    {
        return Category::whereNull('parent_id')
            ->when($excludeId, fn ($q) => $q->where('id', '!=', $excludeId))
            ->get();
    }

    public function create(Request $request): Category
    {
        $data = $this->validate($request);
        $data['slug'] = Str::slug($data['name']);

        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        return Category::create($data);
    }

    public function update(Request $request, Category $category): Category
    {
        $data = $this->validate($request, $category->id);

        if ($category->name !== $data['name']) {
            $data['slug'] = Str::slug($data['name']);
        }

        if ($request->hasFile('image')) {
            if ($category->image) {
                Storage::disk('public')->delete($category->image);
            }
            $data['image'] = $request->file('image')->store('categories', 'public');
        }

        if ($request->boolean('remove_image') && $category->image) {
            Storage::disk('public')->delete($category->image);
            $data['image'] = null;
        }

        $category->update($data);

        return $category;
    }

    public function delete(Category $category): void
    {
        if ($category->products()->exists()) {
            throw new \Exception('Kategori memiliki produk.');
        }

        if ($category->children()->exists()) {
            throw new \Exception('Kategori memiliki sub-kategori.');
        }

        if ($category->image) {
            Storage::disk('public')->delete($category->image);
        }

        $category->delete();
    }

    public function apiTree()
    {
        return Category::withCount('products')
            ->whereNull('parent_id')
            ->with(['children' => fn ($q) => $q->withCount('products')])
            ->get();
    }

    private function validate(Request $request, ?int $id = null): array
    {
        return $request->validate([
            'name'        => 'required|string|max:255|unique:categories,name,' . $id,
            'description' => 'nullable|string',
            'parent_id'   => 'nullable|exists:categories,id',
            'image'       => 'nullable|image|max:2048',
            'remove_image'=> 'boolean',
        ]);
    }
}
