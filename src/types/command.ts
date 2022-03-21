import {
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandsOnlyBuilder,
} from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type slashExecuteFunction = (interaction: CommandInteraction, ...args: any[]) => Promise<void>

export interface SlashCommand {
    data: SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | SlashCommandOptionsOnlyBuilder
        | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>,
    execute: slashExecuteFunction
}