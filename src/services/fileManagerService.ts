
export interface FileOperation {
  type: 'open' | 'create' | 'rename' | 'move' | 'delete' | 'list';
  filename?: string;
  newFilename?: string;
  path?: string;
  newPath?: string;
  content?: string;
}

export interface FileManagerResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Mock file system for demonstration purposes
const mockFileSystem: { [key: string]: any } = {
  'documents': {
    'work': {
      'project_plan.docx': { content: 'Project planning document content...' },
      'budget.xlsx': { content: 'Financial spreadsheet data...' },
      'meeting_notes.txt': { content: 'Notes from team meetings...' }
    },
    'personal': {
      'resume.pdf': { content: 'CV content...' },
      'tax_return_2024.pdf': { content: 'Tax return document...' }
    },
    'vacation_photos': {
      'beach.jpg': { content: 'Beach photo binary data...' },
      'mountains.jpg': { content: 'Mountain photo binary data...' }
    }
  },
  'downloads': {
    'installer.exe': { content: 'Software installer binary...' },
    'music.mp3': { content: 'Audio file data...' }
  }
};

// Check if a message is a file management request
export const isFileManagementRequest = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  const fileOperations = [
    'open file', 'open document', 'open folder',
    'create file', 'create folder', 'create document',
    'rename file', 'rename folder', 'rename document',
    'move file', 'move folder', 'move document',
    'delete file', 'delete folder', 'delete document',
    'list files', 'list documents', 'list folders',
    'show files', 'show documents', 'show folders'
  ];
  
  return fileOperations.some(op => lowerMessage.includes(op));
};

// Parse file operation from message
export const parseFileOperation = (message: string): FileOperation | null => {
  const lowerMessage = message.toLowerCase();
  
  try {
    // Handle "list" operations
    if (lowerMessage.includes('list files') || lowerMessage.includes('show files') ||
        lowerMessage.includes('list documents') || lowerMessage.includes('show documents') ||
        lowerMessage.includes('list folders') || lowerMessage.includes('show folders')) {
      
      const pathMatch = lowerMessage.match(/in\s+(\S+)/) || lowerMessage.match(/from\s+(\S+)/);
      const path = pathMatch ? pathMatch[1].replace(/['"]/g, '') : '';
      
      return {
        type: 'list',
        path
      };
    }
    
    // Handle "open" operations
    if (lowerMessage.includes('open file') || lowerMessage.includes('open document') || lowerMessage.includes('open folder')) {
      const filenameMatch = lowerMessage.match(/open (?:file|document|folder)\s+([^/\s]+)/) || 
        lowerMessage.match(/open\s+([^/\s]+)/);
      
      const pathMatch = lowerMessage.match(/in\s+(\S+)/) || lowerMessage.match(/from\s+(\S+)/);
      
      if (filenameMatch) {
        return {
          type: 'open',
          filename: filenameMatch[1].replace(/['"]/g, ''),
          path: pathMatch ? pathMatch[1].replace(/['"]/g, '') : ''
        };
      }
    }
    
    // Handle "create" operations
    if (lowerMessage.includes('create file') || lowerMessage.includes('create document') || lowerMessage.includes('create folder')) {
      const filenameMatch = lowerMessage.match(/create (?:file|document|folder)\s+([^/\s]+)/) ||
        lowerMessage.match(/create\s+([^/\s]+)/);
      
      const pathMatch = lowerMessage.match(/in\s+(\S+)/) || lowerMessage.match(/at\s+(\S+)/);
      
      if (filenameMatch) {
        return {
          type: 'create',
          filename: filenameMatch[1].replace(/['"]/g, ''),
          path: pathMatch ? pathMatch[1].replace(/['"]/g, '') : ''
        };
      }
    }
    
    // Handle "rename" operations
    if (lowerMessage.includes('rename file') || lowerMessage.includes('rename document') || lowerMessage.includes('rename folder')) {
      const filenameMatch = lowerMessage.match(/rename (?:file|document|folder)\s+([^/\s]+)/);
      const newFilenameMatch = lowerMessage.match(/to\s+([^/\s]+)/);
      
      if (filenameMatch && newFilenameMatch) {
        return {
          type: 'rename',
          filename: filenameMatch[1].replace(/['"]/g, ''),
          newFilename: newFilenameMatch[1].replace(/['"]/g, '')
        };
      }
    }
    
    // Handle "move" operations
    if (lowerMessage.includes('move file') || lowerMessage.includes('move document') || lowerMessage.includes('move folder')) {
      const filenameMatch = lowerMessage.match(/move (?:file|document|folder)\s+([^/\s]+)/);
      const newPathMatch = lowerMessage.match(/to\s+(\S+)/);
      
      if (filenameMatch && newPathMatch) {
        return {
          type: 'move',
          filename: filenameMatch[1].replace(/['"]/g, ''),
          newPath: newPathMatch[1].replace(/['"]/g, '')
        };
      }
    }
    
    // Handle "delete" operations
    if (lowerMessage.includes('delete file') || lowerMessage.includes('delete document') || lowerMessage.includes('delete folder')) {
      const filenameMatch = lowerMessage.match(/delete (?:file|document|folder)\s+([^/\s]+)/);
      
      if (filenameMatch) {
        return {
          type: 'delete',
          filename: filenameMatch[1].replace(/['"]/g, '')
        };
      }
    }
  } catch (error) {
    console.error('Error parsing file operation:', error);
  }
  
  return null;
};

// Process file management request
export const processFileManagementRequest = (operation: FileOperation): FileManagerResponse => {
  try {
    switch (operation.type) {
      case 'list':
        return handleListOperation(operation);
      
      case 'open':
        return handleOpenOperation(operation);
      
      case 'create':
        return handleCreateOperation(operation);
      
      case 'rename':
        return handleRenameOperation(operation);
      
      case 'move':
        return handleMoveOperation(operation);
      
      case 'delete':
        return handleDeleteOperation(operation);
      
      default:
        return {
          success: false,
          message: 'Unrecognized file operation'
        };
    }
  } catch (error) {
    console.error('Error processing file operation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error processing file operation'
    };
  }
};

// Helper function to navigate through mock file system
const getFileOrFolder = (path: string = ''): any => {
  if (!path) return mockFileSystem;
  
  const parts = path.split('/').filter(Boolean);
  let current = mockFileSystem;
  
  for (const part of parts) {
    if (current[part] === undefined) {
      throw new Error(`Path not found: ${path}`);
    }
    current = current[part];
  }
  
  return current;
};

// Handle list operation
const handleListOperation = (operation: FileOperation): FileManagerResponse => {
  try {
    const folder = getFileOrFolder(operation.path);
    
    if (typeof folder !== 'object') {
      return {
        success: false,
        message: `${operation.path || 'Root'} is not a folder`
      };
    }
    
    const files = Object.keys(folder);
    
    return {
      success: true,
      message: `Found ${files.length} item${files.length === 1 ? '' : 's'} in ${operation.path || 'root'}`,
      data: {
        path: operation.path || 'root',
        files: files.map(file => ({
          name: file,
          isDirectory: typeof folder[file] === 'object' && !('content' in folder[file])
        }))
      }
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error listing files'
    };
  }
};

// Handle open operation
const handleOpenOperation = (operation: FileOperation): FileManagerResponse => {
  if (!operation.filename) {
    return {
      success: false,
      message: 'No filename specified'
    };
  }
  
  try {
    const folder = getFileOrFolder(operation.path);
    
    if (!(operation.filename in folder)) {
      return {
        success: false,
        message: `${operation.filename} not found in ${operation.path || 'root'}`
      };
    }
    
    const file = folder[operation.filename];
    
    if ('content' in file) {
      // It's a file
      return {
        success: true,
        message: `Opened file ${operation.filename}`,
        data: {
          filename: operation.filename,
          content: file.content,
          path: operation.path || 'root'
        }
      };
    } else {
      // It's a directory
      const files = Object.keys(file);
      return {
        success: true,
        message: `Opened folder ${operation.filename} with ${files.length} item${files.length === 1 ? '' : 's'}`,
        data: {
          path: operation.path ? `${operation.path}/${operation.filename}` : operation.filename,
          files: files.map(subfile => ({
            name: subfile,
            isDirectory: typeof file[subfile] === 'object' && !('content' in file[subfile])
          }))
        }
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error opening file'
    };
  }
};

// Handle create operation
const handleCreateOperation = (operation: FileOperation): FileManagerResponse => {
  if (!operation.filename) {
    return {
      success: false,
      message: 'No filename specified'
    };
  }
  
  try {
    const folder = getFileOrFolder(operation.path);
    
    if (operation.filename in folder) {
      return {
        success: false,
        message: `${operation.filename} already exists in ${operation.path || 'root'}`
      };
    }
    
    // Determine if it's a file or folder based on extension
    if (operation.filename.includes('.')) {
      // It's a file
      folder[operation.filename] = { content: operation.content || 'Empty file content' };
      
      return {
        success: true,
        message: `Created file ${operation.filename} in ${operation.path || 'root'}`
      };
    } else {
      // It's a folder
      folder[operation.filename] = {};
      
      return {
        success: true,
        message: `Created folder ${operation.filename} in ${operation.path || 'root'}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error creating file or folder'
    };
  }
};

// Handle rename operation
const handleRenameOperation = (operation: FileOperation): FileManagerResponse => {
  if (!operation.filename || !operation.newFilename) {
    return {
      success: false,
      message: 'Both old and new filenames must be specified'
    };
  }
  
  try {
    const folder = getFileOrFolder(operation.path);
    
    if (!(operation.filename in folder)) {
      return {
        success: false,
        message: `${operation.filename} not found in ${operation.path || 'root'}`
      };
    }
    
    if (operation.newFilename in folder) {
      return {
        success: false,
        message: `${operation.newFilename} already exists in ${operation.path || 'root'}`
      };
    }
    
    // Rename file or folder
    folder[operation.newFilename] = folder[operation.filename];
    delete folder[operation.filename];
    
    return {
      success: true,
      message: `Renamed ${operation.filename} to ${operation.newFilename} in ${operation.path || 'root'}`
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error renaming file or folder'
    };
  }
};

// Handle move operation
const handleMoveOperation = (operation: FileOperation): FileManagerResponse => {
  if (!operation.filename || !operation.newPath) {
    return {
      success: false,
      message: 'Both filename and destination path must be specified'
    };
  }
  
  try {
    const sourceFolder = getFileOrFolder(operation.path);
    const destFolder = getFileOrFolder(operation.newPath);
    
    if (!(operation.filename in sourceFolder)) {
      return {
        success: false,
        message: `${operation.filename} not found in ${operation.path || 'root'}`
      };
    }
    
    if (operation.filename in destFolder) {
      return {
        success: false,
        message: `${operation.filename} already exists in ${operation.newPath}`
      };
    }
    
    // Move file or folder
    destFolder[operation.filename] = sourceFolder[operation.filename];
    delete sourceFolder[operation.filename];
    
    return {
      success: true,
      message: `Moved ${operation.filename} from ${operation.path || 'root'} to ${operation.newPath}`
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error moving file or folder'
    };
  }
};

// Handle delete operation
const handleDeleteOperation = (operation: FileOperation): FileManagerResponse => {
  if (!operation.filename) {
    return {
      success: false,
      message: 'No filename specified'
    };
  }
  
  try {
    const folder = getFileOrFolder(operation.path);
    
    if (!(operation.filename in folder)) {
      return {
        success: false,
        message: `${operation.filename} not found in ${operation.path || 'root'}`
      };
    }
    
    // Delete file or folder
    delete folder[operation.filename];
    
    return {
      success: true,
      message: `Deleted ${operation.filename} from ${operation.path || 'root'}`
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Error deleting file or folder'
    };
  }
};

// Complete function to process a file manager request from message
export const processFileManagerCommand = (message: string): FileManagerResponse | null => {
  if (!isFileManagementRequest(message)) return null;
  
  const operation = parseFileOperation(message);
  if (!operation) {
    return {
      success: false,
      message: 'Could not parse file operation from your request. Please try again with a clearer command.'
    };
  }
  
  return processFileManagementRequest(operation);
};
