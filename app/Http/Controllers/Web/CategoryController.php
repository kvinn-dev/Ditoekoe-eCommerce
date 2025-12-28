<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Services\CategoryService;
use Inertia\Inertia;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function __construct(private CategoryService $service) {}

    public function index()
    {
        return Inertia::render('Categories/Index', [
            'categories' => $this->service->getPaginated(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create', [
            'parentCategories' => $this->service->getParentsExcept(),
        ]);
    }

    public function store(Request $request)
    {
        $this->service->create($request);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Kategori berhasil ditambahkan!');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category,
            'parentCategories' => $this->service->getParentsExcept($category->id),
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $this->service->update($request, $category);

        return redirect()
            ->route('categories.index')
            ->with('success', 'Kategori berhasil diperbarui!');
    }

    public function destroy(Category $category)
    {
        try {
            $this->service->delete($category);
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Kategori berhasil dihapus!');
    }
}
