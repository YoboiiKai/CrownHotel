<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class FeedbackController extends Controller
{
    /**
     * Get all feedback for the authenticated user
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $user = Auth::user();
        $feedbacks = Feedback::where('user_id', $user->id)
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->get();
            
        return response()->json([
            'success' => true,
            'feedbacks' => $feedbacks
        ]);
    }
    
    /**
     * Store a new feedback
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'feedbackType' => 'required|in:employee,hotel_service',
            'employeeName' => 'nullable|string|max:255',
            'employeeId' => 'nullable|integer',
            'serviceType' => 'required|string|max:255',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
            'anonymous' => 'required|boolean'
        ]);
        
        // Custom validation for employee feedback
        if ($request->feedbackType === 'employee' && empty($request->employeeName) && empty($request->employeeId)) {
            return response()->json([
                'success' => false,
                'errors' => [
                    'employeeName' => ['Please select an employee for employee feedback.']
                ]
            ], 422);
        }
        
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }
        
        $user = Auth::user();
        
        $feedback = new Feedback([
            'user_id' => $user->id,
            'feedback_type' => $request->feedbackType,
            'employee_name' => $request->employeeName,
            'employee_id' => $request->employeeId,
            'service_type' => $request->serviceType,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'anonymous' => $request->anonymous ?? false,
            'status' => 'published'
        ]);
        
        $feedback->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Feedback submitted successfully',
            'feedback' => $feedback
        ]);
    }
    
    /**
     * Delete a feedback
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $user = Auth::user();
        $feedback = Feedback::where('id', $id)
            ->where('user_id', $user->id)
            ->first();
            
        if (!$feedback) {
            return response()->json([
                'success' => false,
                'message' => 'Feedback not found or you do not have permission to delete it'
            ], 404);
        }
        
        // Soft delete by changing status
        $feedback->status = 'deleted';
        $feedback->save();
        
        return response()->json([
            'success' => true,
            'message' => 'Feedback deleted successfully'
        ]);
    }
}
