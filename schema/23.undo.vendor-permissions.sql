delete from roles_permissions
  where permission_subject_id in (select id from permission_subject where name = 'vendor');

delete from permission_subject where name = 'vendor';

delete from roles_permissions
  where permission_subject_id in (select id from permission_subject where name = 'vendors');

delete from permission_subject where name = 'vendors';
