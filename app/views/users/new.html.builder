xml.div do
  xml << form_for(@user) do |f|
    f.label(:name, t(:username)) + 
    f.text_field(:name) +
    f.label(:email, t(:email)) +
    f.email_field(:email) +
    f.label(:password) +
    f.password_field(:password) +
    f.label(:password_confirmation, t(:confirm_password)) +
    f.password_field(:password_confirmation) +
    f.submit
  end
end

