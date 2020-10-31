import { ToolModifierState } from './tool-modifier-state';
export abstract class ToolModifier {
    abstract getState(): ToolModifierState;
    abstract setState(toolmodifierState: ToolModifierState): void;
}
