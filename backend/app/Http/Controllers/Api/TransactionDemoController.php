<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TransactionDemoService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class TransactionDemoController extends Controller
{
    use ApiResponseTrait;

    private TransactionDemoService $service;

    public function __construct(TransactionDemoService $service)
    {
        $this->service = $service;
    }

    public function successful(Request $request)
    {
        $result = $this->service->successfulTransaction();
        return $this->success($result, $result['message']);
    }

    public function failed(Request $request)
    {
        $result = $this->service->failedTransaction();
        return $this->success($result, $result['message']);
    }

    public function withoutTransaction(Request $request)
    {
        $result = $this->service->withoutTransaction();
        return $this->success($result, $result['message']);
    }

    public function withTransaction(Request $request)
    {
        $result = $this->service->withTransaction();
        return $this->success($result, $result['message']);
    }

    public function history(Request $request)
    {
        $history = $this->service->getTransactionHistory();
        return $this->success($history, 'Transaction history retrieved');
    }
}
