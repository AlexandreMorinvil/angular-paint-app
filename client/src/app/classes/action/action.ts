import { Tool } from '@app/classes/tool';
import { ToolModifierState } from '@app/classes/tool-modifier-state';
import { Interaction } from './interactions';

export class Action {
    private tool: Tool;
    private toolModifierState: ToolModifierState[] = [];
    private toolModifierStateCurrent: ToolModifierState[] = [];
    private interaction: Interaction;

    constructor(tool: Tool, interaction: Interaction) {
        this.tool = tool;
        this.interaction = interaction;
        tool.modifiers.forEach((modifier) => {
            this.toolModifierState.push(modifier.getState());
        });
    }

    execute(): void {
        this.memorizeCurrentModifiersState();
        this.setModifiersToActionState();
        this.tool.execute(this.interaction);
        this.setModifiersToMemorizedState();
        this.clearModifiersMemorizedState();
    }

    private memorizeCurrentModifiersState(): void {
        this.tool.modifiers.forEach((modifier) => {
            this.toolModifierStateCurrent.push(modifier.getState());
        });
    }

    private setModifiersToActionState(): void {
        this.tool.modifiers.forEach((modifier, index) => {
            modifier.setState(this.toolModifierState[index]);
        });
    }

    private setModifiersToMemorizedState(): void {
        this.tool.modifiers.forEach((modifier, index) => {
            modifier.setState(this.toolModifierStateCurrent[index]);
        });
    }

    private clearModifiersMemorizedState(): void {
        this.toolModifierStateCurrent = [];
    }
}
