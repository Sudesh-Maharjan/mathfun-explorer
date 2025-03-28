import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, List } from "lucide-react";

const GameRules: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-6 ">
      <Card className="max-w-2xl w-full rounded-2xl overflow-hidden bg-white border border-gray-200">
        <CardHeader className="bg-blue-600 text-white py-2 px-6">
          <CardTitle className="text-center text-2xl font-semibold">Game Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              -Quiz has 3 difficulty levels to choose from. Easy. Medium and Hard
            </div>
            <div className="flex items-start gap-3">
              -Each difficulty includes Addition, Subtraction, Division, and Multiplication.
            </div>
            <div className="flex items-start gap-3">
              -Players will solve 10 questions before submitting.
            </div>
            <div className="flex items-start gap-3">
              -Previously played questions won’t repeat if student again plays the game.
            </div>
            <div className="flex items-start gap-3">
              -If no new questions are available, teachers need to add more from the admin panel. game can stop midway if enough questions are not added.
            </div>
          </div>
         
        </CardContent>
      </Card>
    </div>
  );
};

export default GameRules;
