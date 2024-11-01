"use server";
import { getServerSession } from 'next-auth';

import authOptions, { SessionUser } from '../lib/authOptions';
import { supabase } from '../lib/supabase';

export type NoteType = {
    id: number;
    typeName: string;
    owner: number;
};

export type Note = {
    id: number;
    content: string;
    typeId: number;
    color: string;
};

// Create a new note
export const createNote = async (noteData: Omit<Note, 'id'>): Promise<Note | null> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return null;
    }

    const { data, error } = await supabase
        .from('notes')
        .insert([noteData])
        .select()
        .single();

    if (error) {
        console.error('Error creating note:', error.message);
        return null;
    }

    return data as Note;
};

// Fetch note types
export const fetchNoteTypes = async (): Promise<NoteType[]> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return [];
    }
    const userId = session.user.id;

    const { data, error } = await supabase
        .from('notes_type')
        .select('id, typeName, owner')
        .eq('owner', userId);

    if (error) {
        console.error('Error fetching note types:', error.message);
        return [];
    }

    return (data as NoteType[]) || [];
};

// Fetch notes
export type NoteWithTypeName = Note & { typeName: string };

export const fetchNotes = async (): Promise<NoteWithTypeName[]> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return [];
    }
    const userId = session.user.id;

    try {
        // Fetch the note types for the user
        const { data: noteTypes, error: typeError } = await supabase
            .from('notes_type')
            .select('id, typeName')
            .eq('owner', userId);

        if (typeError || !noteTypes) {
            console.error('Error fetching note types:', typeError?.message);
            return [];
        }

        const typeMap = new Map<number, string>((noteTypes as NoteType[]).map(type => [type.id, type.typeName]));

        // Fetch the notes using the retrieved type IDs
        const { data: notes, error: notesError } = await supabase
            .from('notes')
            .select('*')
            .in('typeId', Array.from(typeMap.keys()));

        if (notesError) {
            console.error('Error fetching notes:', notesError.message);
            return [];
        }

        return (notes as Note[]).map(note => ({
            ...note,
            typeName: typeMap.get(note.typeId) || 'Unknown',
        }));
    } catch (error) {
        console.error('Error fetching notes:', (error as Error).message);
        return [];
    }
};

// Update note
export const updateNote = async (noteId: number, updatedNoteData: Partial<Omit<Note, 'id'>>): Promise<Note | null> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return null;
    }

    const { data, error } = await supabase
        .from('notes')
        .update(updatedNoteData)
        .eq('id', noteId)
        .select()
        .single();

    if (error) {
        console.error('Error updating note:', error.message);
        return null;
    }

    return data as Note;
};

// Delete note
export const deleteNote = async (noteId: number): Promise<boolean> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return false;
    }

    const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', noteId);

    if (error) {
        console.error('Error deleting note:', error.message);
        return false;
    }

    return true;
};

// Delete note type
export const deleteType = async (typeId: number): Promise<boolean> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return false;
    }

    const { error } = await supabase
        .from('notes_type')
        .delete()
        .eq('id', typeId);

    if (error) {
        console.error('Error deleting note type:', error.message);
        return false;
    }

    return true;
};

// Create a new note type
export const createNoteType = async (typeName: string): Promise<boolean> => {
    const session = await getServerSession(authOptions) as { user: { id: string } & SessionUser } | null;
    if (!session || !session.user?.id) {
        console.error('No valid session found or user ID missing');
        return false;
    }
    const userId = session.user.id;

    const { error } = await supabase
        .from('notes_type')
        .insert([{ typeName, owner: userId }]);

    if (error) {
        console.error('Error creating note type:', error.message);
        return false;
    }

    return true;
};
