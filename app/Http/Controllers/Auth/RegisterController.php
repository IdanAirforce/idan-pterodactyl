<?php

namespace Pterodactyl\Http\Controllers\Auth;

use Illuminate\Http\JsonResponse;
use Pterodactyl\Http\Requests\Auth\RegisterRequest;
use Pterodactyl\Services\Users\UserCreationService;

class RegisterController extends AbstractLoginController
{
    public function register(RegisterRequest $request, UserCreationService $creationService): JsonResponse
    {
        $user = $creationService->handle($request->toCreationArray());

        return $this->sendLoginResponse($user, $request);
    }
}
