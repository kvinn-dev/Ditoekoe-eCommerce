<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $service) {}

    public function index()
    {
        return Inertia::render('Admin/Categories/Index', [
            'categories' => $this->service->getPaginated(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Categories/Create', [
            'parentCategories' => $this->service->getParentsExcept(),
        ]);
    }

    public function store(Request $request)
    {
        $this->service->create($request);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Kategori berhasil ditambahkan');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Admin/Categories/Edit', [
            'category' => $category,
            'parentCategories' => $this->service->getParentsExcept($category->id),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $this->service->update($request, $category);

        return redirect()
            ->route('admin.categories.index')
            ->with('success', 'Kategori berhasil diperbarui');
    }

    public function destroy(Category $category)
    {
        try {
            $this->service->delete($category);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Kategori berhasil dihapus');
    }
}
