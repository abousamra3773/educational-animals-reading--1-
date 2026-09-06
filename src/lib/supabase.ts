import { createClient } from '@supabase/supabase-js';


// Initialize database client
const supabaseUrl = 'https://byzvtyjvlzvzfifmhbsd.databasepad.com';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Ijk3ZTcyMDdjLWQxNDYtNDAxYy1iZjI4LTgwNWM1N2IzY2I4NiJ9.eyJwcm9qZWN0SWQiOiJieXp2dHlqdmx6dnpmaWZtaGJzZCIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzY5NDM3MTE0LCJleHAiOjIwODQ3OTcxMTQsImlzcyI6ImZhbW91cy5kYXRhYmFzZXBhZCIsImF1ZCI6ImZhbW91cy5jbGllbnRzIn0.uAJhoeCRuWfZb13Ah9v_MlW3oBxqMIon9EG0fPFoVCQ';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };